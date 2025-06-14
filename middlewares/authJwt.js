// Middleware bech nverifiw JWT token w roles
const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")
const db = require("../models")
const Patient = db.patient
const Medecin = db.medecin
const Admin = db.admin

// Nverifiw token
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({
      message: "No token provided!", //Ma famech token!
    })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!", //Ma3andekch l'autorisation!
      })
    }
    req.userId = decoded.id
    req.userType = decoded.type // 'patient', 'medecin', or 'admin'
    next()
  })
}

// Nverifiw ken l'utilisateur patient
const isPatient = async (req, res, next) => {
  if (req.userType !== "patient") {
    return res.status(403).send({
      message: "Lazem tkoun patient bech ta3mel l'action hathi",
    })
  }

  try {
    const patient = await Patient.findById(req.userId)
    if (!patient) {
      return res.status(403).send({
        message: "Patient mech mawjoud",
      })
    }
    next()
  } catch (error) {
    return res.status(500).send({
      message: "fama 7aja mouch mrigla: " + error.message,
    })
  }
}

// Nverifiw ken l'utilisateur medecin
const isMedecin = async (req, res, next) => {
  if (req.userType !== "medecin") {
    return res.status(403).send({
      message: "Lazem tkoun medecin bech ta3mel l'action hathi",
    })
  }

  try {
    const medecin = await Medecin.findById(req.userId)
    if (!medecin) {
      return res.status(403).send({
        message: "Medecin mech mawjoud",
      })
    }
    next()
  } catch (error) {
    return res.status(500).send({
      message: "fama 7aja mouch mrigla: " + error.message,
    })
  }
}

// Nverifiw ken l'utilisateur admin
const isAdmin = async (req, res, next) => {
  if (req.userType !== "admin") {
    return res.status(403).send({
      message: "Lazem tkoun admin bech ta3mel l'action hathi",
    })
  }

  try {
    const admin = await Admin.findById(req.userId)
    if (!admin) {
      return res.status(403).send({
        message: "Admin mech mawjoud",
      })
    }
    next()
  } catch (error) {
    return res.status(500).send({
      message: "fama 7aja mouch mrigla: " + error.message,
    })
  }
}

const authJwt = {
  verifyToken,
  isPatient,
  isMedecin,
  isAdmin,
}

module.exports = authJwt
