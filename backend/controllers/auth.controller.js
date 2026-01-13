// controllers/auth.controller.js
const db = require("../models")
const config = require("../config/auth.config")
const Patient = db.patient
const Medecin = db.medecin
const Admin = db.admin

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// ============================
// SIGNUP - PATIENT
// ============================
exports.signupPatient = async (req, res) => {
  try {
    const patient = new Patient({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cin: req.body.cin,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      telephone: req.body.phone,
      birthDate: req.body.birthDate,
      address: req.body.address,
    })

    await patient.save()

    res.status(201).send({ message: "Patient registered successfully" })
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occurred during patient signup" })
  }
}

// ============================
// SIGNIN - PATIENT
// ============================
exports.signinPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email })
    if (!patient) return res.status(404).send({ message: "Patient not found" })

    const passwordIsValid = bcrypt.compareSync(req.body.password, patient.password)
    if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: "Incorrect password" })

    const token = jwt.sign({ id: patient._id, type: "patient" }, config.secret, { expiresIn: 86400 * 7 })

    res.status(200).send({
      id: patient._id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occurred during patient signin" })
  }
}

// ============================
// SIGNIN - MEDECIN
// ============================
exports.signinMedecin = async (req, res) => {
  try {
    const medecin = await Medecin.findOne({ email: req.body.email })
    if (!medecin) return res.status(404).send({ message: "Doctor not found" })

    const passwordIsValid = bcrypt.compareSync(req.body.password, medecin.password)
    if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: "Incorrect password" })

    const token = jwt.sign({ id: medecin._id, type: "medecin" }, config.secret, { expiresIn: 86400 })

    res.status(200).send({
      id: medecin._id,
      firstName: medecin.firstName,
      lastName: medecin.lastName,
      email: medecin.email,
      role: medecin.role,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occurred during doctor signin" })
  }
}

// ============================
// SIGNIN - ADMIN
// ============================
exports.signinAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email })
    if (!admin) return res.status(404).send({ message: "Admin not found" })

    const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password)
    if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: "Incorrect password" })

    const token = jwt.sign({ id: admin._id, type: "admin" }, config.secret, { expiresIn: 86400 })

    res.status(200).send({
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occurred during admin signin" })
  }
}
