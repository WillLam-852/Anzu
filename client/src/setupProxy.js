const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    ["/api/all_pages", "/api/all_pages/titles"],
    createProxyMiddleware({
      target: "http://localhost:5001",
    })
  );
};
