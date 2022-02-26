const { Express } = require("express");
const tetoControllers = require("../controllers/tetoControllers")

/**
 * @param {Express} app
 */
module.exports = async (app) => {
  app.get("/teto/", tetoControllers.stats)
  app.get("/teto/:user", tetoControllers.user)
}