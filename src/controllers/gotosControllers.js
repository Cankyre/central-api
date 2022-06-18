const { Request, Response } = require("express");
const { supabase } = require("../main");
const { checkAuth } = require("./auth");

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.goto = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const _res = await supabase
    .from("gotos")
    .select("*")
    .eq("keyword", req.params.goto);
  res.json(_res.data);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.createGoto = async (req, res) => {
  if (!checkAuth(req.query.auth, "ADMIN")) {
    res.status(401).json({});
    return;
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  const _res = await supabase.from("gotos").insert(req.body);
  res.json(_res);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.deleteGoto = async (req, res) => {
  if (!checkAuth(req.query.auth, "ADMIN")) {
    res.status(401).json({});
    return;
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  const _res = await supabase
    .from("gotos")
    .delete()
    .eq("keyword", req.params.goto);
  res.json(_res);
};

/**
 * @param {Request} req
 * @param {Response} res
 */
module.exports.listGotos = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const _res = await supabase.from("gotos").select("*");
  res.json(_res.data);
};
