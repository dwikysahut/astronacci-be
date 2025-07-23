const helpers = require("../helpers");

const dummyProducts = {
  articles: [
    { id: 1, title: "Artikel 1" },
    { id: 2, title: "Artikel 2" },
    { id: 3, title: "Artikel 3" },
    { id: 4, title: "Artikel 4" },
    { id: 5, title: "Artikel 5" },
    { id: 6, title: "Artikel 6" },
    { id: 7, title: "Artikel 7" },
    { id: 8, title: "Artikel 8" },
    { id: 9, title: "Artikel 9" },
    { id: 10, title: "Artikel 10" },
    { id: 11, title: "Artikel 11" },
    { id: 12, title: "Artikel 12" },
  ],
  videos: [
    { id: 1, title: "Video 1" },
    { id: 2, title: "Video 2" },
    { id: 3, title: "Video 3" },
    { id: 4, title: "Video 4" },
    { id: 5, title: "Video 5" },
     { id: 6, title: "Video 6" },
    { id: 7, title: "Video 7" },
    { id: 8, title: "Video 8" },
    { id: 9, title: "Video 9" },
    { id: 10, title: "Video 10" },
    { id: 11, title: "Video 11" },
    { id: 12, title: "Video 12" },
  ],
};

module.exports = {
  getContent: (req, res) => {
    const { maxArticles, maxVideos } = req.contentLimit;

    const articles = dummyProducts.articles.slice(0, maxArticles);
    const videos = dummyProducts.videos.slice(0, maxVideos);

    return helpers.response(res, 200, "Konten berhasil diambil", {
      articles,
      videos,
      contentLimit: {
        maxArticles,
        maxVideos,
      },
    });
  },
};
