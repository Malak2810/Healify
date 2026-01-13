// Routes mta3 admin
const controller = require("../controllers/admin.controller")
const { authJwt } = require("../middlewares")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
    next()
  })

  // Route bech nfas5ou patient
  app.delete("/api/admin/patients/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deletePatient)
 
  // Route bech nfas5ou medecin
  app.delete("/api/admin/medecins/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteMedecin);

  // Route bech na3mlou medecin jdid
  app.post("/api/admin/medecins", [authJwt.verifyToken, authJwt.isAdmin], controller.createMedecin)

  // Route bech nmodifiw medecin
  app.put("/api/admin/medecins/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateMedecin)

  // Route bech njibou liste mta3 patients
  app.get("/api/admin/patients", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllPatients)

  // Route bech njibou liste mta3 medecins
  app.get("/api/admin/medecins", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllMedecins)

  // Get all appointments
  app.get("/api/admin/appointments", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllAppointments)
  
  // Get dashboard stats
  app.get("/api/admin/stats", [authJwt.verifyToken, authJwt.isAdmin], controller.getDashboardStats);
}