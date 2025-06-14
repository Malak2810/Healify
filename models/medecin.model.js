// Model mta3 medecin b Mongoose
const mongoose = require("mongoose")

const medecinSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email mech sa7i7"],
    },
    password: {
      type: String,
      required: true,
    },
    specialite: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
    },
    disponibilite: {
      type: Object, // Format: {lundi: ["8:00-12:00", "14:00-18:00"], mardi: [...], ...}
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Medecin", medecinSchema)
