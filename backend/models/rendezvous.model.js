// Model mta3 rendez-vous b Mongoose
const mongoose = require("mongoose")

const rendezvousSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: { 
      type: String,
      required: true,
    },
    duration: { 
      type: Number,
      default: 30,
    },
    status: { 
      type: String,
      enum: ["scheduled", "canceled", "completed"],
      default: "scheduled",
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
