// Model mta3 patient b Mongoose
const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: { 
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
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
    },
    birthDate: { 
      type: Date,
    },
    address: { 
      type: String,
    },
    role: {
      type: String,
      default: "patient"
    },

  },
  {
    timestamps: true, // Ya3mel createdAt w updatedAt automatiquement
  },
)

module.exports = mongoose.model("Patient", patientSchema)
