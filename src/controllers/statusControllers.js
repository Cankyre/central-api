const { Request, Response } = require("express");
const { supabase } = require("../main");
const { checkAuth } = require("./auth")

var lastPings = {}

module.exports.storeStatuses = async () => {
  let obj = {}
  for (let i in lastPings) {
    obj[i] = lastPings[i][0] + 300000 > Date.now() 
    ? (lastPings[i][1] < 30000 ? lastPings[i] : "Major outage")
    : "Offline"
  } 
  if (Object.keys(obj).length > 0) {
    const _ = await supabase.from("status")
    .insert({status: obj})
  }
}

setInterval(this.storeStatuses, 300000)

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.ping = (req, res) => {
  if (!checkAuth(req.query.auth, "SET_STATUS")) {
    res.send("0")
    return;
  }
  lastPings[req.query.product]
  if (req.query.product) {
    lastPings[req.query.product] = [Date.now(), Date.now() - req.query.ts]
  }
  res.send("1")
}

/**
 * @param {Request} _
 * @param {Response} res
 */
module.exports.get = async (_, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const _res = await supabase.from("status")
    .select("*")
    .order('id', {ascending: false})
    .range(0, 288)
  res.json(_res.data)
}