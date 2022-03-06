require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const express = require("express");

const app = express();
var time = require('express-timestamp')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(time.init)

const options = {
  schema: "public",
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

module.exports.supabase = createClient(
  "https://kqzupntxqqfebfzmueks.supabase.co",
  process.env.SUPABASE_KEY,
  options
);

const ticketsRoutes = require("./routes/ticketsRoutes");
const gotosRoutes = require("./routes/gotoRoutes")
const statusRoutes = require("./routes/statusRoutes")
const tetoRoutes = require("./routes/tetoRoutes")
ticketsRoutes(app);
gotosRoutes(app);
statusRoutes(app)
tetoRoutes(app);

app.get("/", (_, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ received: Date.now() });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Serveur à l'écoute");
});
