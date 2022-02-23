const { Express } = require("express");
const ticketsControllers = require("../controllers/ticketsControllers");

/**
 * Creates API routes for posts API.
 * @param {Express} app
 */
module.exports = (app) => {
  app.post("/tickets", ticketsControllers.createTicket);
};
