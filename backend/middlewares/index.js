// Regroupement mta3 middlewares
const authJwt = require("./authJwt")
const verifySignUp = require("./verifySignUp")

module.exports = {
  authJwt,
  verifySignUp,
}
