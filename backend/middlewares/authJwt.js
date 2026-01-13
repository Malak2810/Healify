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
      message: "You must be a patient to perform this action",
    })
  }

  try {
    const patient = await Patient.findById(req.userId)
    if (!patient) {
      return res.status(403).send({
        message: "Patient not found",
      })
    }
    next()
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong: " + error.message,
    })
  }
}

// Nverifiw ken l'utilisateur medecin
const isMedecin = async (req, res, next) => {
  if (req.userType !== "medecin") {
    return res.status(403).send({
      message: "You must be a doctor to perform this action",
    })
  }

  try {
    const medecin = await Medecin.findById(req.userId)
    if (!medecin) {
      return res.status(403).send({
        message: "Doctor not found",
      })
    }
    next()
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong: " + error.message,
    })
  }
}

// Nverifiw ken l'utilisateur admin
const isAdmin = async (req, res, next) => {
  if (req.userType !== "admin") {
    return res.status(403).send({
      message: "You must be an admin to perform this action",
    })
  }

  try {
    const admin = await Admin.findById(req.userId)
    if (!admin) {
      return res.status(403).send({
        message: "Admin not found",
      })
    }
    next()
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong: " + error.message,
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
