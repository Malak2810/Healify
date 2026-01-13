// Model mta3 medecin b Mongoose
const mongoose = require("mongoose");

const medecinSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String,
      required: true,
    },
    lastName: { 
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"],
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
      required: true,
    },
    disponibilite: {
      lundi: [{ type: String }],
      mardi: [{ type: String }],
      mercredi: [{ type: String }],
      jeudi: [{ type: String }],
      vendredi: [{ type: String }],
      samedi: [{ type: String }],
      dimanche: [{ type: String }],
    },
    role: {
      type: String,
      default: "medecin"
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medecin", medecinSchema);

