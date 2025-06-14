// Controller mta3 admin 
const db = require("../models")
const bcrypt = require("bcryptjs")
const Patient = db.patient
const Medecin = db.medecin
const RendezVous = db.rendezvous

// Nfas5ou patient
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id

    // Nlawjou 3al patient
    const patient = await Patient.findById(patientId)

    if (!patient) {
      return res.status(404).send({ message: "Patient mech mawjoud" })
    }

    // Nfas5ou les rendez-vous mta3 l'patient
    await RendezVous.deleteMany({ patientId: patientId })

    // Nfas5ou l'patient
    await Patient.findByIdAndDelete(patientId)

    res.status(200).send({
      message: "Patient tfasa5",
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil suppression mta3 patient",
    })
  }
}

// Na3mlou medecin jdid
exports.createMedecin = async (req, res) => {
  try {
    // Na3mlou creation mta3 medecin jdid
    const medecin = new Medecin({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), // Nchiffrou l'password
      specialite: req.body.specialite,
      telephone: req.body.telephone,
      disponibilite: req.body.disponibilite || {},
    })

    await medecin.save()

    res.status(201).send({
      message: "Medecin tsjel",
      medecin: {
        id: medecin._id,
        nom: medecin.nom,
        prenom: medecin.prenom,
        email: medecin.email,
        specialite: medecin.specialite,
      },
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil creation mta3 medecin",
    })
  }
}

// Nmodifiw medecin
exports.updateMedecin = async (req, res) => {
  try {
    const medecinId = req.params.id

    // Nlawjou 3al medecin
    const medecin = await Medecin.findById(medecinId)

    if (!medecin) {
      return res.status(404).send({ message: "Medecin mech mawjoud" })
    }

    // Nmodifiw les champs
    const updateData = {
      nom: req.body.nom || medecin.nom,
      prenom: req.body.prenom || medecin.prenom,
      specialite: req.body.specialite || medecin.specialite,
      telephone: req.body.telephone || medecin.telephone,
      disponibilite: req.body.disponibilite || medecin.disponibilite,
    }

    // Ken fama password jdid, nzidouha
    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 8)
    }

    const updatedMedecin = await Medecin.findByIdAndUpdate(medecinId, updateData, { new: true })

    res.status(200).send({
      message: "Medecin tmodifya",
      medecin: {
        id: updatedMedecin._id,
        nom: updatedMedecin.nom,
        prenom: updatedMedecin.prenom,
        email: updatedMedecin.email,
        specialite: updatedMedecin.specialite,
      },
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil modification mta3 medecin",
    })
  }
}

// Njibou liste mta3 patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password") // Ma njibch lpassword

    res.status(200).send(patients)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recuperation mta3 liste patients",
    })
  }
}

// Njibou liste mta3 medecins
exports.getAllMedecins = async (req, res) => {
  try {
    const medecins = await Medecin.find().select("-password") // Ma njibch lpassword

    res.status(200).send(medecins)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recuperation mta3 liste medecins",
    })
  }
}
