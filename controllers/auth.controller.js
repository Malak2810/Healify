// Controller mta3 authentication (signup & signin)
const db = require("../models")
const config = require("../config/auth.config")
const Patient = db.patient
const Medecin = db.medecin
const Admin = db.admin

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Signup mta3 patient
exports.signupPatient = async (req, res) => {
  try {
    // Na3mlou creation mta3 patient jdid
    const patient = new Patient({
      nom: req.body.nom,
      prenom: req.body.prenom,
      cin: req.body.cin,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), // Nchiffrou lpassword
      telephone: req.body.telephone,
      dateNaissance: req.body.dateNaissance,
      adresse: req.body.adresse,
    })

    await patient.save()

    res.status(200).send({
      message: "Patient tsjel",
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil signup mta3 patient",
    })
  }
}

// Signin mta3 patient
exports.signinPatient = async (req, res) => {
  try {
    // Nlawjou 3al patient bl email
    const patient = await Patient.findOne({ email: req.body.email })

    if (!patient) {
      return res.status(404).send({ message: "Patient mech mawjoud" })
    }

    // Nverifiw lpassword
    const passwordIsValid = bcrypt.compareSync(req.body.password, patient.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Password ghalet",
      })
    }

    // Na3tiw token
    const token = jwt.sign({ id: patient._id, type: "patient" }, config.secret, {
      expiresIn: 86400, // 24 hours
    })

    res.status(200).send({
      id: patient._id,
      nom: patient.nom,
      prenom: patient.prenom,
      email: patient.email,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil signin mta3 patient",
    })
  }
}

// Signin mta3 medecin
exports.signinMedecin = async (req, res) => {
  try {
    // Nlawjou 3al medecin bl email
    const medecin = await Medecin.findOne({ email: req.body.email })

    if (!medecin) {
      return res.status(404).send({ message: "Medecin mech mawjoud" })
    }

    // Nverifiw lpassword
    const passwordIsValid = bcrypt.compareSync(req.body.password, medecin.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Password ghalet",
      })
    }

    // Na3tiw token
    const token = jwt.sign({ id: medecin._id, type: "medecin" }, config.secret, {
      expiresIn: 86400, // 24 hours
    })

    res.status(200).send({
      id: medecin._id,
      nom: medecin.nom,
      prenom: medecin.prenom,
      email: medecin.email,
      specialite: medecin.specialite,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil signin mta3 medecin",
    })
  }
}

// Signin mta3 admin
exports.signinAdmin = async (req, res) => {
  try {
    // Nlawjou 3al admin bl email
    const admin = await Admin.findOne({ email: req.body.email })

    if (!admin) {
      return res.status(404).send({ message: "Admin mech mawjoud" })
    }

    // Nverifiw lpassword
    const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Password ghalet",
      })
    }

    // Na3tiw token
    const token = jwt.sign({ id: admin._id, type: "admin" }, config.secret, {
      expiresIn: 86400, // 24 hours
    })

    res.status(200).send({
      id: admin._id,
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      accessToken: token,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil signin mta3 admin",
    })
  }
}
