// Model mta3 admin b Mongoose
const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "admin"
    },

  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Admin", adminSchema)
