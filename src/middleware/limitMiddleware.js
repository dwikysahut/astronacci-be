const helpers = require("../helpers");
const { User } = require("../models");

module.exports = {
  limitAccessByMembership: async (req, res, next) => {
    const userId = req.token?.id;

    if (!userId) {
      return helpers.response(res, 401, "Unauthorized");
    }

    try {
      const user = await User.findByPk(userId, {
        attributes: ["membershipType"],
      });
      if (!user) {
        return helpers.response(res, 404, "User tidak ditemukan");
      }

      const limits = {
        A: { articles: 3, videos: 3 },
        B: { articles: 10, videos: 10 },
        C: { articles: Infinity, videos: Infinity },
      };

      const allowed = limits[user.membershipType]; //limits['A']
      if (!allowed) {
        return helpers.response(res, 403, "Tipe membership tidak dikenali");
      }

      req.contentLimit = {
        maxArticles: allowed.articles,
        maxVideos: allowed.videos,
      };

      next();
    } catch (error) {
      console.error("Membership check error:", error);
      return helpers.response(res, 500, "Terjadi kesalahan server");
    }
  },
};
