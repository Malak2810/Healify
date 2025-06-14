// Routes mta3 authentication
const controller = require("../controllers/auth.controller")
const { verifySignUp } = require("../middlewares")

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept")
    next()
  })

  // Route mta3 signup patient
  app.post(
    "/api/auth/signup/patient",
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkDuplicateCIN],
    controller.signupPatient,
  )

  // Route mta3 signin patient
  app.post("/api/auth/signin/patient", controller.signinPatient)

  // Route mta3 signin medecin
  app.post("/api/auth/signin/medecin", controller.signinMedecin)

  // Route mta3 signin admin
  app.post("/api/auth/signin/admin", controller.signinAdmin)
}
