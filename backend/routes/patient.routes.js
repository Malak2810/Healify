// Routes mta3 patient
const controller = require("../controllers/patient.controller")
const { authJwt } = require("../middlewares")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
    next()
  })

  // Route bech njibou profile mta3 patient
  app.get("/api/patient/profile", [authJwt.verifyToken, authJwt.isPatient], controller.getProfile)

  // Route bech nmodifiw profile mta3 patient
  app.put("/api/patient/profile", [authJwt.verifyToken, authJwt.isPatient], controller.updateProfile)

  // Route bech nbadlou password mta3 patient
  app.put("/api/patient/change-password", [authJwt.verifyToken, authJwt.isPatient], controller.changePassword)

  // Route bech nlawjou 3al medecins selon specialite
  app.get("/api/patient/search-medecins", [authJwt.verifyToken, authJwt.isPatient], controller.searchMedecins)

  // Route bech na3mlou rendez-vous jdid
  app.post("/api/patient/rendez-vous", [authJwt.verifyToken, authJwt.isPatient], controller.createRendezVous)

  // Route bech njibou historique mta3 rendez-vous
  app.get("/api/patient/rendez-vous", [authJwt.verifyToken, authJwt.isPatient], controller.getRendezVousHistory)

  // Route bech njibou liste mta3 medecins
  app.get("/api/patient/medecins", [authJwt.verifyToken, authJwt.isPatient], controller.getAllMedecins)
}
