// Routes mta3 medecin
const controller = require("../controllers/medecin.controller")
const { authJwt } = require("../middlewares")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
    next()
  })

  // Route bech njibou profile mta3 medecin
  app.get("/api/medecin/profile", [authJwt.verifyToken, authJwt.isMedecin], controller.getProfile)

  // Route bech nmodifiw profile mta3 medecin
  app.put("/api/medecin/profile", [authJwt.verifyToken, authJwt.isMedecin], controller.updateProfile)

  // Route bech nbadlou password mta3 medecin
  app.put("/api/medecin/change-password", [authJwt.verifyToken, authJwt.isMedecin], controller.changePassword)

  // Route bech njibou liste mta3 rendez-vous
  app.get("/api/medecin/rendez-vous", [authJwt.verifyToken, authJwt.isMedecin], controller.getRendezVousList)

  // Route bech nmodifiw rendez-vous
  app.put("/api/medecin/rendez-vous/:id", [authJwt.verifyToken, authJwt.isMedecin], controller.updateRendezVous)
}
