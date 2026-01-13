// Controller for Patient
const db = require("../models")
const bcrypt = require("bcryptjs")
const Patient = db.patient
const Medecin = db.medecin
const RendezVous = db.rendezvous

// Get patient profile
exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId).select("-password")
    if (!patient) return res.status(404).send({ message: "Patient not found" })
    res.status(200).send(patient)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving profile" })
  }
}

// Update patient profile
exports.updateProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId)
    if (!patient) return res.status(404).send({ message: "Patient not found" })

    const updateData = {
      firstName: req.body.firstName || patient.firstName,
      lastName: req.body.lastName || patient.lastName,
      telephone: req.body.telephone || patient.telephone,
      address: req.body.address || patient.address,
      birthDate: req.body.birthDate || patient.birthDate,
    }

    const updatedPatient = await Patient.findByIdAndUpdate(req.userId, updateData, { new: true })

    res.status(200).send({ message: "Profile updated successfully", patient: updatedPatient })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error updating profile" })
  }
}

// Change patient password
exports.changePassword = async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId)
    if (!patient) return res.status(404).send({ message: "Patient not found" })

    const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, patient.password)
    if (!passwordIsValid) return res.status(401).send({ message: "Old password is incorrect" })

    patient.password = bcrypt.hashSync(req.body.newPassword, 8)
    await patient.save()

    res.status(200).send({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error changing password" })
  }
}

// Search doctors by specialty
exports.searchMedecins = async (req, res) => {
  try {
    const specialite = req.query.specialite
    const condition = specialite ? { specialite: { $regex: specialite, $options: "i" } } : {}

    const medecins = await Medecin.find(condition).select("-password").lean()

    res.status(200).send(medecins)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error searching doctors" })
  }
}

// Create new appointment
exports.createRendezVous = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.body.medecinId)
    if (!medecin) return res.status(404).send({ message: "Doctor not found" })

    const rendezvous = new RendezVous({
      date: req.body.date,
      time: req.body.time,             // CHANGE from heure → time
      duration: req.body.duration || 30, // CHANGE from duree → duration
      notes: req.body.notes || "",
      patientId: req.userId,
      medecinId: req.body.medecinId,
    })


    await rendezvous.save()

    res.status(201).send({ message: "Appointment created successfully", rendezvous })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error creating appointment" })
  }
}

// Get appointment history
exports.getRendezVousHistory = async (req, res) => {
  try {
    const rendezvous = await RendezVous.find({ patientId: req.userId })
      .populate("medecinId", "firstName lastName specialite nom prenom") // include both variants
      .sort({ date: 1, time: 1 }) // sort earliest first; server uses `time` not `heure`
      .lean(); // lean() returns plain objects (optional but useful)


    res.status(200).send(rendezvous)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving appointment history" })
  }
}

// Get all doctors
exports.getAllMedecins = async (req, res) => {
  try {
    const medecins = await Medecin.find().select("-password")
    res.status(200).send(medecins)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving doctors" })
  }
}

