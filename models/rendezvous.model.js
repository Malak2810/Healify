// Model mta3 rendez-vous b Mongoose
const mongoose = require("mongoose")

const rendezvousSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    heure: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    duree: {
      type: Number, // Durée en minutes
      default: 30,
    },
    statut: {
      type: String,
      enum: ["programmé", "annulé", "terminé"],
      default: "programmé",
    },
    notes: {
      type: String,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medecinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medecin",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("RendezVous", rendezvousSchema)
