const { Express } = require("express");
const gotosControllers = require("../controllers/gotosControllers");

/**
 * @param {Express} app
 */
module.exports = (app) => {
  app.post("/goto", gotosControllers.createGoto);
  app.get("/goto/list", gotosControllers.listGotos);
  app.get("/goto/:goto", gotosControllers.goto);
  app.delete("/goto/:goto", gotosControllers.deleteGoto);
};
