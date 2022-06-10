const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    ["/Tea_ceremony", "/Ikebana", "/Wagashi", "/Yukata"],
    createProxyMiddleware({
      target: "http://localhost:5001",
    })
  );
};
