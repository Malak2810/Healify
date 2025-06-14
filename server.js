// Fichier principal mta3 server
const express = require("express")
const connectToDatabase = require("./config/db.config")
const cors = require("cors")


const app = express()

// Na3mlou configuration mta3 CORS
var corsOptions = {
  origin: "http://localhost:8081",
}

app.use(cors(corsOptions))

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Na3mlou connexion lil database
connectToDatabase()

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

// Na3mlou import lil routes
require("./routes/auth.routes")(app)
require("./routes/patient.routes")(app)
require("./routes/medecin.routes")(app)
require("./routes/admin.routes")(app)

// Na3mlou configuration mta3 port
const PORT = process.env.PORT || 8080
// Na3mlou démarrage mta3 server
app.listen(PORT, () => {
  console.log(`Server ya5dem 3al port ${PORT}.`)
})
