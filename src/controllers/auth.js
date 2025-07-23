const bcrypt = require("bcrypt");
const { User } = require("../models"); // Import the Sequelize User model
const { customErrorApi } = require("../helpers/CustomError");
const helpers = require("../helpers"); // Assuming you have helpers like `nodemailer`
const { promiseHandler } = require("../middleware/promiseHandler");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
module.exports = {
  registerGoogle: promiseHandler(async (req, res, next) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { tokenId, phoneNumber } = req.body;

    if (!tokenId || !phoneNumber) {
      return next(customErrorApi(400, "Token Google dan nomor telepon wajib diisi"));
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return next(customErrorApi(401, "Token Google tidak valid"));
    }

    const payload = ticket.getPayload();
    const { email, name, sub: socialId } = payload;

    // Cek jika email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(customErrorApi(409, "Email sudah terdaftar, silakan login dengan Google"));
    }

    // Buat user baru
    const newUser = await User.create({
      email,
      name,
      password: null,
      phoneNumber,
      provider: "google",
      socialId,
      membershipType: "A", // default membership
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        membershipType: newUser.membershipType,
        provider: newUser.provider,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const responseUser = { ...newUser.toJSON(), token };
    delete responseUser.password;

    return helpers.response(res, 200, "Register dengan Google Berhasil", responseUser);
  }),
  loginGoogle: promiseHandler(async (req, res, next) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const { tokenId } = req.body;

    if (!tokenId) {
      return next(customErrorApi(400, "Token ID Google tidak ditemukan"));
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return next(customErrorApi(401, "Token Google tidak valid"));
    }

    const payload = ticket.getPayload();
    const { email, name, sub: socialId } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Buat user baru jika belum terdaftar
      user = await User.create({
        email,
        name,
        password: null,
        phoneNumber: "-",
        provider: "google",
        socialId,
        membershipType: "A",
      });
    } else {
      // Update socialId jika kosong atau berbeda
      if (!user.socialId || user.socialId !== socialId) {
        await user.update({
          socialId,
          provider: "google", // opsional: update provider juga
        });
      }
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        membershipType: user.membershipType,
        provider: user.provider,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const responseUser = { ...user.toJSON(), token: jwtToken };
    delete responseUser.password;

    return helpers.response(res, 200, "Login Google Berhasil", responseUser);
  }),
  fetchMe: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(customErrorApi(401, "Authorization header missing"));
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return next(customErrorApi(401, "Token missing"));
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.id;

      // Find user
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return next(customErrorApi(404, "User not found"));
      }

      // Return user data
      return res.status(200).json({
        status: "success",
        message: "User data fetched successfully",
        data: { token },
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return next(customErrorApi(401, "Invalid or expired token"));
      }
      return next(error);
    }
  },
  register: promiseHandler(async (req, res, next) => {
    const { email, name, password, phoneNumber } = req.body;

    if (!email || !name || !password || !phoneNumber) {
      return next(customErrorApi(400, "Semua field wajib diisi"));
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(customErrorApi(401, "Email telah terdaftar"));
    }

    // Hash the password
    const passwordHash = bcrypt.hashSync(password, 6);

    // Create the user in the database
    const newUser = await User.create({
      email,
      name,
      password: passwordHash,
      phoneNumber,
      membershipType: "A", // Default membership
      provider: "manual", // Explicitly mark as manual registration
      socialId: null, // No socialId for manual register
    });

    const responseUser = { ...newUser.toJSON() };
    delete responseUser.password;

    return helpers.response(res, 200, "Register Berhasil", responseUser);
  }),

  login: promiseHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(customErrorApi(401, "Email tidak terdaftar"));
    }

    // Check the password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(customErrorApi(401, "Password salah"));
    }

    const token = jwt.sign({ id: user.id, email: user.email, roleId: user.roleId }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Prepare response data
    const responseUser = { ...user.toJSON(), token };
    delete responseUser.password;
    return helpers.response(res, 200, "Login Berhasil", responseUser);
  }),
  logout: promiseHandler(async (req, res, next) => {
    return helpers.response(res, 200, "Logout Berhasil");
  }),

  loginFacebook: promiseHandler(async (req, res, next) => {
    const { accessToken } = req.body;

    if (!accessToken) {
      return next(customErrorApi(400, "Access token Facebook tidak ditemukan"));
    }

    try {
      const fbResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
      );

      const { id: socialId, name, email } = fbResponse.data;

      if (!email) {
        return next(customErrorApi(400, "Email tidak tersedia dari akun Facebook"));
      }

      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({
          email,
          name,
          password: null,
          phoneNumber: "-",
          provider: "facebook",
          socialId,
          membershipType: "A", // default
        });
      } else {
        // Update socialId jika kosong atau berbeda
        if (!user.socialId || user.socialId !== socialId) {
          await user.update({
            socialId,
            provider: "facebook",
          });
        }
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          membershipType: user.membershipType,
          provider: user.provider,
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      const responseUser = { ...user.toJSON(), token };
      delete responseUser.password;

      return helpers.response(res, 200, "Login Facebook Berhasil", responseUser);
    } catch (error) {
      console.error("Facebook Login Error:", error?.response?.data || error.message);
      return next(customErrorApi(401, "Token Facebook tidak valid"));
    }
  }),
};
