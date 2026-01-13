const db = require("../models")
const bcrypt = require("bcryptjs")
const Patient = db.patient
const Medecin = db.medecin
const RendezVous = db.rendezvous

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id
    const patient = await Patient.findById(patientId)
    if (!patient) return res.status(404).send({ message: "Patient not found" })

    await RendezVous.deleteMany({ patientId })
    await Patient.findByIdAndDelete(patientId)

    res.status(200).send({ message: "Patient deleted successfully" })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error deleting patient" })
  }
}

// Delete doctor
exports.deleteMedecin = async (req, res) => {
  try {
    const medecinId = req.params.id;
    const medecin = await Medecin.findById(medecinId);
    if (!medecin) return res.status(404).send({ message: "Doctor not found" });

    // Optionally, you can remove related appointments if needed
    await RendezVous.deleteMany({ medecinId });

    await Medecin.findByIdAndDelete(medecinId);

    res.status(200).send({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error deleting doctor" });
  }
};


// Create new doctor
exports.createMedecin = async (req, res) => {
  try {
    // ensure required fields are present (server-side validation)
    const { firstName, lastName, email, password, telephone, specialite } = req.body;
    if (!firstName || !lastName || !email || !password || !telephone || !specialite) {
      return res.status(400).send({ message: "firstName, lastName, email, password, telephone and specialite are required" });
    }

    const medecin = new Medecin({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 8),
      telephone,
      specialite,
      role: "medecin", // optional if schema already defaults
    });

    await medecin.save();

    res.status(201).send({
      message: "Doctor registered successfully",
      medecin: {
        id: medecin._id,
        firstName: medecin.firstName,
        lastName: medecin.lastName,
        email: medecin.email,
        telephone: medecin.telephone,
        specialite: medecin.specialite,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error creating doctor" });
  }
};


// Update doctor
exports.updateMedecin = async (req, res) => {
  try {
    const medecinId = req.params.id;
    const medecin = await Medecin.findById(medecinId);
    if (!medecin) return res.status(404).send({ message: "Doctor not found" });

    const updateData = {
      firstName: req.body.firstName || medecin.firstName,
      lastName: req.body.lastName || medecin.lastName,
      telephone: req.body.telephone || medecin.telephone,
      specialite: req.body.specialite || medecin.specialite,
      // keep other fields as needed
    };

    if (req.body.password) {
      updateData.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedMedecin = await Medecin.findByIdAndUpdate(medecinId, updateData, { new: true });

    res.status(200).send({
      message: "Doctor updated successfully",
      medecin: {
        id: updatedMedecin._id,
        firstName: updatedMedecin.firstName,
        lastName: updatedMedecin.lastName,
        email: updatedMedecin.email,
        telephone: updatedMedecin.telephone,
        specialite: updatedMedecin.specialite,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error updating doctor" });
  }
};


// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password")
    res.status(200).send(patients)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving patients" })
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

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    // populate patient and doctor names from references
    const appointments = await RendezVous.find()
      .populate("patientId", "firstName lastName") // only select firstName and lastName
      .populate("medecinId", "firstName lastName") // only select firstName and lastName
      .exec();

    const formattedAppointments = appointments.map((apt) => ({
      id: apt._id,
      patientName: apt.patientId ? `${apt.patientId.firstName} ${apt.patientId.lastName}` : "Unknown Patient",
      doctorName: apt.medecinId ? `Dr. ${apt.medecinId.firstName} ${apt.medecinId.lastName}` : "Unknown Doctor",
      date: apt.date,
      time: apt.time,
      status: apt.status,
    }));

    res.status(200).send(formattedAppointments);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving appointments" });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Medecin.countDocuments();
    const totalAppointments = await RendezVous.countDocuments();
    const completedAppointments = await RendezVous.countDocuments({ status: "completed" });
    const completionRate = totalAppointments === 0 ? 0 : Math.round((completedAppointments / totalAppointments) * 100);

    res.status(200).send({ totalPatients, totalDoctors, totalAppointments, completionRate });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error retrieving dashboard stats" });
  }
};
