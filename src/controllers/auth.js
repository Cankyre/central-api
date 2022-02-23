require("dotenv").config();

module.exports.checkAuth = (pwd, access) => {
  if (process.env[access + "_PWD"] == pwd) {
    return 1;
  }
  return 0;
};
