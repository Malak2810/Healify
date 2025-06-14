// Script bech na3mlou initialisation mta3 MongoDB database - Version corrigée
const connectToDatabase = require("../config/db.config") // Utilise ta fonction de connexion
const bcrypt = require("bcryptjs")

// Na3mlou import lil models
const Patient = require("../models/patient.model")
const Medecin = require("../models/medecin.model")
const Admin = require("../models/admin.model")
const RendezVous = require("../models/rendezvous.model")

// Na3mlou initialisation mta3 database
async function initDatabase() {
  try {
    // Na3mlou connexion lil database
    await connectToDatabase()

    console.log("Na3mlou suppression mta3 données existantes...")
    await Patient.deleteMany({})
    await Medecin.deleteMany({})
    await Admin.deleteMany({})
    await RendezVous.deleteMany({})
    console.log("Données existantes tfas5ou!")

    // Na3mlou creation mta3 admin par défaut
    const admin = new Admin({
      nom: "Admin",
      prenom: "System",
      email: "admin@clinique.com",
      password: bcrypt.hashSync("admin123", 8),
    })
    await admin.save()
    console.log("Admin par défaut tsjel b najé7!")

    // Na3mlou creation mta3 medecins par défaut
    const medecinsData = [
      {
        nom: "Ben Salah",
        prenom: "Mohamed",
        email: "mohamed.bensalah@clinique.com",
        password: bcrypt.hashSync("med123", 8),
        specialite: "Cardiologie",
        telephone: "98123456",
        disponibilite: {
          lundi: ["08:00-12:00", "14:00-17:00"],
          mardi: ["08:00-12:00", "14:00-17:00"],
          mercredi: ["08:00-12:00"],
          jeudi: ["08:00-12:00", "14:00-17:00"],
          vendredi: ["08:00-12:00"],
        },
      },
      {
        nom: "Trabelsi",
        prenom: "Sonia",
        email: "sonia.trabelsi@clinique.com",
        password: bcrypt.hashSync("sonia123", 8),
        specialite: "Pédiatrie",
        telephone: "97654321",
        disponibilite: {
          lundi: ["09:00-13:00", "15:00-18:00"],
          mardi: ["09:00-13:00"],
          mercredi: ["09:00-13:00", "15:00-18:00"],
          jeudi: ["09:00-13:00"],
          vendredi: ["09:00-13:00", "15:00-18:00"],
        },
      },
      {
        nom: "Gharbi",
        prenom: "Ahmed",
        email: "ahmed.gharbi@clinique.com",
        password: bcrypt.hashSync("ahmed123", 8),
        specialite: "Dermatologie",
        telephone: "96789012",
        disponibilite: {
          lundi: ["10:00-14:00"],
          mardi: ["10:00-14:00", "16:00-19:00"],
          mercredi: ["10:00-14:00"],
          jeudi: ["10:00-14:00", "16:00-19:00"],
          vendredi: ["10:00-14:00"],
        },
      },
    ]

    const savedMedecins = []
    for (const medecinData of medecinsData) {
      const medecin = new Medecin(medecinData)
      const savedMedecin = await medecin.save()
      savedMedecins.push(savedMedecin)
      console.log(`Medecin ${savedMedecin.nom} ${savedMedecin.prenom} tsjel!`)
    }

    // Na3mlou creation mta3 patients par défaut
    const patientsData = [
      {
        nom: "Mejri",
        prenom: "Karim",
        cin: "12345678",
        email: "karim.mejri@gmail.com",
        password: bcrypt.hashSync("karim123", 8),
        telephone: "55123456",
        dateNaissance: new Date("1985-05-15"),
        adresse: "Tunis, Tunisie",
      },
      {
        nom: "Ben Ali",
        prenom: "Leila",
        cin: "87654321",
        email: "leila.benali@gmail.com",
        password: bcrypt.hashSync("leila123", 8),
        telephone: "54789012",
        dateNaissance: new Date("1990-10-20"),
        adresse: "Sousse, Tunisie",
      },
    ]

    const savedPatients = []
    for (const patientData of patientsData) {
      const patient = new Patient(patientData)
      const savedPatient = await patient.save()
      savedPatients.push(savedPatient)
      console.log(`Patient ${savedPatient.nom} ${savedPatient.prenom} tsjel!`)
    }

    // Na3mlou creation mta3 rendez-vous par défaut
    console.log("Na3mlou creation mta3 rendez-vous...")

    const rendezvousData = [
      {
        date: new Date("2024-06-15"),
        heure: "09:30",
        duree: 30,
        notes: "Consultation de routine",
        patientId: savedPatients[0]._id,
        medecinId: savedMedecins[1]._id, // Dr. Sonia (Pédiatrie)
      },
      {
        date: new Date("2024-06-20"),
        heure: "11:00",
        duree: 45,
        notes: "Suivi traitement cardiaque",
        patientId: savedPatients[1]._id,
        medecinId: savedMedecins[0]._id, // Dr. Mohamed (Cardiologie)
      },
      {
        date: new Date("2024-06-25"),
        heure: "14:30",
        duree: 30,
        notes: "Première consultation dermatologique",
        patientId: savedPatients[0]._id,
        medecinId: savedMedecins[2]._id, // Dr. Ahmed (Dermatologie)
      },
      {
        date: new Date("2024-06-28"),
        heure: "10:00",
        duree: 30,
        notes: "Contrôle de routine",
        patientId: savedPatients[1]._id,
        medecinId: savedMedecins[1]._id, // Dr. Sonia (Pédiatrie)
      },
    ]

    const savedRendezVous = []
    for (const rdvData of rendezvousData) {
      const rdv = new RendezVous(rdvData)
      const savedRdv = await rdv.save()
      savedRendezVous.push(savedRdv)

      // Na3mlou populate bech njibou les noms
      const populatedRdv = await RendezVous.findById(savedRdv._id)
        .populate("patientId", "nom prenom")
        .populate("medecinId", "nom prenom specialite")

      console.log(
        `Rendez-vous: ${populatedRdv.patientId.nom} ${populatedRdv.patientId.prenom} avec Dr. ${populatedRdv.medecinId.nom} (${populatedRdv.medecinId.specialite}) le ${populatedRdv.date.toLocaleDateString()} à ${populatedRdv.heure}`,
      )
    }

    console.log("\nInitialisation mta3 MongoDB database kamlet")
    console.log(`Statistiques:`)
    console.log(`   - ${await Admin.countDocuments()} Admin(s)`)
    console.log(`   - ${await Medecin.countDocuments()} Medecin(s)`)
    console.log(`   - ${await Patient.countDocuments()} Patient(s)`)
    console.log(`   - ${await RendezVous.countDocuments()} Rendez-vous`)

    // Na3mlou affichage mta3 informations de connexion
    console.log("\n=== Informations de connexion ===")
    console.log("Admin:")
    console.log("   Email: admin@clinique.com")
    console.log("   Password: admin123")
    console.log("\nMedecins:")
    console.log("   Dr. Mohamed Ben Salah (Cardiologie):")
    console.log("     Email: mohamed.bensalah@clinique.com")
    console.log("     Password: med123")
    console.log("   Dr. Sonia Trabelsi (Pédiatrie):")
    console.log("     Email: sonia.trabelsi@clinique.com")
    console.log("     Password: sonia123")
    console.log("   Dr. Ahmed Gharbi (Dermatologie):")
    console.log("     Email: ahmed.gharbi@clinique.com")
    console.log("     Password: ahmed123")
    console.log("\nPatients:")
    console.log("   Karim Mejri:")
    console.log("     Email: karim.mejri@gmail.com")
    console.log("     Password: karim123")
    console.log("   Leila Ben Ali:")
    console.log("     Email: leila.benali@gmail.com")
    console.log("     Password: leila123")
  } catch (error) {
    console.error("Mochkla fil initialisation mta3 database:", error)
  } finally {
    // Na3mlou fermeture mta3 connexion
    const mongoose = require("mongoose")
    await mongoose.connection.close()
    console.log("🔌 Connexion lil database tsakret.")
    process.exit(0)
  }
}

// Na3mlou execution mta3 fonction d'initialisation
initDatabase()
