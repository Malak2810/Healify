// Middleware bech nverifiw si l'email déjà mawjoud wala lee
const db = require("../models")
const Patient = db.patient
const Medecin = db.medecin
const Admin = db.admin

// Nverifiw ken l'email mawjoud déjà
const checkDuplicateEmail = async (req, res, next) => {
  try {
    // Nlawjou fil patients
    const patientEmail = await Patient.findOne({ email: req.body.email })

    if (patientEmail) {
      return res.status(400).send({
        message: "Error: This email is already registered for a patient",
      })
    }

    // Nlawjou fil medecins
    const medecinEmail = await Medecin.findOne({ email: req.body.email })

    if (medecinEmail) {
      return res.status(400).send({
        message: "Error: This email is already registered for a doctor",
      })
    }

    // Nlawjou fil admins
    const adminEmail = await Admin.findOne({ email: req.body.email })

    if (adminEmail) {
      return res.status(400).send({
        message: "Error: This email is already registered for an admin",
      })
    }

    // Ken l'email mech mawjoud, nkammlou
    next()
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong: " + error.message,
    })
  }
}

// Nverifiw ken CIN mawjoud déjà (llpatient akahw)
const checkDuplicateCIN = async (req, res, next) => {
  try {
    // Nlawjou fil patients
    const patientCIN = await Patient.findOne({ cin: req.body.cin })

    if (patientCIN) {
      return res.status(400).send({
        message: "Error: This CIN is already registered",
      })
    }

    // Ken CIN mech mawjoud, nkammlou
    next()
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong: " + error.message,
    })
  }
}

const verifySignUp = {
  checkDuplicateEmail,
  checkDuplicateCIN,
}

module.exports = verifySignUp
