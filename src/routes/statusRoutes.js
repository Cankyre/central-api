const { Express } = require("express");
const statusControllers = require("../controllers/statusControllers");

/**
 * @param {Express} app
 */
module.exports = async (app) => {
  app.get("/status/get", statusControllers.get);
  app.get("/status/ping", statusControllers.ping);
};
