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
        message: "Fama mochkla : L'email hatha déjà mawjoud 3and patient",
      })
    }

    // Nlawjou fil medecins
    const medecinEmail = await Medecin.findOne({ email: req.body.email })

    if (medecinEmail) {
      return res.status(400).send({
        message: "Fama mochkla : L'email hatha déjà mawjoud 3and medecin",
      })
    }

    // Nlawjou fil admins
    const adminEmail = await Admin.findOne({ email: req.body.email })

    if (adminEmail) {
      return res.status(400).send({
        message: "Fama mochkla : L'email hatha déjà mawjoud 3and admin",
      })
    }

    // Ken l'email mech mawjoud, nkammlou
    next()
  } catch (error) {
    return res.status(500).send({
      message: "fama 7aja mouch mrigla: " + error.message,
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
        message: "Fama mochkla : CIN hatha déjà mawjoud",
      })
    }

    // Ken CIN mech mawjoud, nkammlou
    next()
  } catch (error) {
    return res.status(500).send({
      message: "fama 7aja mouch mrigla: " + error.message,
    })
  }
}

const verifySignUp = {
  checkDuplicateEmail,
  checkDuplicateCIN,
}

module.exports = verifySignUp
