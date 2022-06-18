const { Request, Response } = require("express");
const computeStats = require("../functions/computeStats");
const axios = require("axios").default;
const { infos, records } = require("tetr.js").TetraChannel.users;

_stats = {};

function setStats() {
  axios
    .get("https://ch.tetr.io/api/users/lists/league/all")
    .then((res) => {
      console.log("Stats updated at " + new Date().toISOString());
      _stats = computeStats.stats(res.data);
      setTimeout(setStats, res.data.cache.cached_until - Date.now());
    })
    .catch(console.error);
}
setStats()

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.stats = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (_stats) {
    res.json({ ..._stats, error: false });
  } else {
    res.json({ error: true });
  }
};

module.exports.user = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    if (
      req.params.user.split(" ").filter((i) => !/^\s+$/g.test(i)).length == 1
    ) {
      res.json(
        computeStats.user(
          await infos(req.params.user),
          await records(req.params.user)
        )
      );
    } else if (
      req.params.user.split(" ").filter((i) => !/^\s+$/g.test(i)).length == 2
    ) {
      res.json(
        computeStats.two_users(
          await infos(req.params.user.split(" ")[0]),
          await infos(req.params.user.split(" ")[1])
        )
      );
    } else {
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.json({});
  }
};
