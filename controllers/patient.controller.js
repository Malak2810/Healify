// Controller mta3 patient
const db = require("../models")
const bcrypt = require("bcryptjs")
const Patient = db.patient
const Medecin = db.medecin
const RendezVous = db.rendezvous

// Njibou profile mta3 patient
exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId).select("-password") // Ma njibch lpassword

    if (!patient) {
      return res.status(404).send({ message: "Patient mech mawjoud" })
    }

    res.status(200).send(patient)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recuperation mta3 profile",
    })
  }
}

// Nmodifiw profile mta3 patient
exports.updateProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId)

    if (!patient) {
      return res.status(404).send({ message: "Patient mech mawjoud" })
    }

    // Nmodifiw les champs
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.userId,
      {
        nom: req.body.nom || patient.nom,
        prenom: req.body.prenom || patient.prenom,
        telephone: req.body.telephone || patient.telephone,
        adresse: req.body.adresse || patient.adresse,
        dateNaissance: req.body.dateNaissance || patient.dateNaissance,
      },
      { new: true },
    )

    res.status(200).send({
      message: "Profile tmodifya",
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil modification mta3 profile",
    })
  }
}

// Nbadlou password mta3 patient
exports.changePassword = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId)

    if (!patient) {
      return res.status(404).send({ message: "Patient mech mawjoud" })
    }

    // Nverifiw l'ancien password
    const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, patient.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "L'ancien password ghalet",
      })
    }

    // Nbadlou lpassword
    await Patient.findByIdAndUpdate(req.userId, {
      password: bcrypt.hashSync(req.body.newPassword, 8),
    })

    res.status(200).send({
      message: "Password tbadl",
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil changement mta3 password",
    })
  }
}

// Nlawjou 3al medecins selon specialite
exports.searchMedecins = async (req, res) => {
  try {
    const specialite = req.query.specialite
    const condition = specialite ? { specialite: { $regex: specialite, $options: "i" } } : {}

    const medecins = await Medecin.find(condition).select("-password") // Ma njibch lpassword

    res.status(200).send(medecins)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recherche mta3 medecins",
    })
  }
}

// Na3mlou rendez-vous jdid
exports.createRendezVous = async (req, res) => {
  try {
    // Nverifiw ken lmedecin mawjoud
    const medecin = await Medecin.findById(req.body.medecinId)

    if (!medecin) {
      return res.status(404).send({ message: "Medecin mech mawjoud" })
    }

    // Na3mlou rendez-vous jdid
    const rendezvous = new RendezVous({
      date: req.body.date,
      heure: req.body.heure,
      duree: req.body.duree || 30,
      notes: req.body.notes || "",
      patientId: req.userId,
      medecinId: req.body.medecinId,
    })

    await rendezvous.save()

    res.status(201).send({
      message: "Rendez-vous tsjel",
      rendezvous: rendezvous,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil creation mta3 rendez-vous",
    })
  }
}

// Njibou historique mta3 rendez-vous
exports.getRendezVousHistory = async (req, res) => {
  try {
    const rendezvous = await RendezVous.find({ patientId: req.userId })
      .populate("medecinId", "nom prenom specialite")
      .sort({ date: -1, heure: 1 })

    res.status(200).send(rendezvous)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recuperation mta3 historique rendez-vous",
    })
  }
}
