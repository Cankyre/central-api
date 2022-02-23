const { Request, Response } = require("express");
const axios = require("axios").default;

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.createTicket = async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    bypassTimeLimit = false;
    if (req.query.q3.startsWith(process.env.CANKYRE_TICKET_PASSWORD)) {
      bypassTimeLimit = true;
      req.query.q3 = req.query.q3.slice(
        process.env.CANKYRE_TICKET_PASSWORD.length
      );
    }
    axios
      .post(process.env.TICKETS_WEBHOOK_URL, {
        username:
          "New " +
          (req.query.q2.toLowerCase() == "Other (describe in question 3)"
            ? "demand"
            : req.query.q2.toLowerCase()),
        embeds: [
          {
            title: "New ticket created for product __" + req.query.q1 + "__",
            type: "rich",
            description: req.query.q3,
          },
        ],
        allowed_mentions: [],
      })
      .then(() => {
        if (bypassTimeLimit) {
          res.send("OK-");
          return;
        }
        res.send("OK");
      })
      .catch(() => {
        res.send("Not OK");
      });
  } catch (err) {
    console.log(err);
    res.send("Not OK");
  }
};
