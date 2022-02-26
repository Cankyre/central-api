const { Request, Response } = require("express");
const computeStats = require("../functions/computeStats")
const axios = require("axios").default
const { infos } = require("tetr.js").TetraChannel.users

_stats = {}

function setStats() {
  axios.get("https://ch.tetr.io/api/users/lists/league/all").then(res => {
    console.log("Stats updated at " + new Date().toISOString())
    _stats = computeStats.stats(res.data)
    setTimeout(setStats, res.data.cache.cached_until - Date.now())
  })
}
setStats()

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.stats = async (req, res) => {
  if (_stats) {
    res.json({..._stats, error: false})
  } else {
    res.json({error: true})
  }
}

module.exports.user = async (req, res) => {
  res.json(computeStats.user((await infos(req.params.user))))
}