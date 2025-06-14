// Controller mta3 medecin
const db = require("../models")
const bcrypt = require("bcryptjs")
const Medecin = db.medecin
const RendezVous = db.rendezvous
const Patient = db.patient

// Njibou profile mta3 medecin
exports.getProfile = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.userId).select("-password") // Ma njibch lpassword

    if (!medecin) {
      return res.status(404).send({ message: "Medecin mech mawjoud" })
    }

    res.status(200).send(medecin)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recuperation mta3 profile",
    })
  }
}

// Nmodifiw profile mta3 medecin
exports.updateProfile = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.userId)

    if (!medecin) {
      return res.status(404).send({ message: "Medecin mech mawjoud" })
    }

    // Nmodifiw les champs
    await Medecin.findByIdAndUpdate(
      req.userId,
      {
        telephone: req.body.telephone || medecin.telephone,
        disponibilite: req.body.disponibilite || medecin.disponibilite,
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

// Nbadlou password mta3 medecin
exports.changePassword = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.userId)

    if (!medecin) {
      return res.status(404).send({ message: "Medecin mech mawjoud" })
    }

    // Nverifiw l'ancien password
    const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, medecin.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "L'ancien password ghalet",
      })
    }

    // Nbadlou lpassword
    await Medecin.findByIdAndUpdate(req.userId, {
      password: bcrypt.hashSync(req.body.newPassword, 8),
    })

    res.status(200).send({
      message: "Password tbadel",
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil changement mta3 password",
    })
  }
}

// Njibou liste mta3 rendez-vous
exports.getRendezVousList = async (req, res) => {
  try {
    const rendezvous = await RendezVous.find({ medecinId: req.userId })
      .populate("patientId", "nom prenom telephone")
      .sort({ date: 1, heure: 1 })

    res.status(200).send(rendezvous)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil recuperation mta3 liste rendez-vous",
    })
  }
}

// Nmodifiw rendez-vous
exports.updateRendezVous = async (req, res) => {
  try {
    const rendezvousId = req.params.id

    // Nlawjou 3al rendez-vous
    const rendezvous = await RendezVous.findOne({
      _id: rendezvousId,
      medecinId: req.userId,
    })

    if (!rendezvous) {
      return res.status(404).send({ message: "Rendez-vous mech mawjoud wala mech mta3ek" })
    }

    // Nmodifiw les champs
    const updatedRendezVous = await RendezVous.findByIdAndUpdate(
      rendezvousId,
      {
        date: req.body.date || rendezvous.date,
        heure: req.body.heure || rendezvous.heure,
        duree: req.body.duree || rendezvous.duree,
        notes: req.body.notes || rendezvous.notes,
        statut: req.body.statut || rendezvous.statut,
      },
      { new: true },
    )

    res.status(200).send({
      message: "Rendez-vous tmodifya",
      rendezvous: updatedRendezVous,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Fama mochkla fil modification mta3 rendez-vous",
    })
  }
}
