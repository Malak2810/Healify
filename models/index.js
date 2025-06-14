// Initialisation mta3 models
const mongoose = require("mongoose")

const db = {}

db.mongoose = mongoose

// Na3mlou import lil models
db.patient = require("./patient.model.js")
db.medecin = require("./medecin.model.js")
db.admin = require("./admin.model.js")
db.rendezvous = require("./rendezvous.model.js")

module.exports = db
