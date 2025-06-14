// Model mta3 patient b Mongoose
const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    cin: {
      type: String,
      required: true,
      unique: true,
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
    telephone: {
      type: String,
    },
    dateNaissance: {
      type: Date,
    },
    adresse: {
      type: String,
    },
  },
  {
    timestamps: true, // Ya3mel createdAt w updatedAt automatiquement
  },
)

module.exports = mongoose.model("Patient", patientSchema)
