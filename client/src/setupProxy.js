const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    ["/api/save"],
    createProxyMiddleware({
      target: "http://localhost:5001",
    })
  );
};
