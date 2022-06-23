const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    ["/api/all_pages", "/api/all_pages/titles", "/api/new_card", "/api/edit_card", "/api/upload_image"],
    createProxyMiddleware({
      target: "http://localhost:5001",
    })
  );
};
