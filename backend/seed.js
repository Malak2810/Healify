// seed.js
// Usage: node seed.js
// Dev-only: wipes Patient, Medecin, RendezVous collections then inserts sample data.

const connectToDatabase = require("./config/db.config");
const db = require("./models");
const bcrypt = require("bcryptjs");

const Patient = db.patient;
const Medecin = db.medecin;
const RendezVous = db.rendezvous;

async function seed() {
  try {
    await connectToDatabase();

    console.log("Connected to DB — clearing collections (dev only)");
    await Patient.deleteMany({});
    await Medecin.deleteMany({});
    await RendezVous.deleteMany({});

    // --- Create Doctors ---
    const doctorData = [
      {
        firstName: "Amine",
        lastName: "Ben Ali",
        email: "amine.benali@example.com",
        password: bcrypt.hashSync("Password123!", 8),
        telephone: "+21650000001",
        specialite: "Cardiology",
        disponibilite: {
          lundi: ["09:00", "17:00"],
          mardi: ["09:00", "17:00"],
          mercredi: ["09:00", "13:00"],
          jeudi: ["12:00", "18:00"],
          vendredi: ["09:00", "15:00"],
          samedi: ["10:00", "14:00"],
          dimanche: [],
        },
      },
      {
        firstName: "Sara",
        lastName: "Mahmoud",
        email: "sara.mahmoud@example.com",
        password: bcrypt.hashSync("Password123!", 8),
        telephone: "+21650000002",
        specialite: "Dermatology",
        disponibilite: {
          lundi: ["10:00", "18:00"],
          mardi: ["10:00", "18:00"],
          mercredi: ["10:00", "14:00"],
          jeudi: ["09:00", "13:00"],
          vendredi: ["09:00", "12:00"],
          samedi: [],
          dimanche: [],
        },
      },
      {
        firstName: "Khaled",
        lastName: "Trabelsi",
        email: "khaled.trabelsi@example.com",
        password: bcrypt.hashSync("Password123!", 8),
        telephone: "+21650000003",
        specialite: "Pediatrics",
        disponibilite: {
          lundi: ["08:30", "12:30"],
          mardi: ["14:00", "18:00"],
          mercredi: ["08:30", "12:30"],
          jeudi: ["14:00", "18:00"],
          vendredi: ["08:30", "12:30"],
          saturday: [],
          dimanche: [],
        },
      },
      {
        firstName: "Nadia",
        lastName: "Hassine",
        email: "nadia.hassine@example.com",
        password: bcrypt.hashSync("Password123!", 8),
        telephone: "+21650000004",
        specialite: "Neurology",
        disponibilite: {
          lundi: ["09:00", "16:00"],
          mardi: ["09:00", "16:00"],
          wednesday: ["09:00", "13:00"],
          jeudi: ["09:00", "16:00"],
          vendredi: ["09:00", "13:00"],
          saturday: [],
          dimanche: [],
        },
      },
      {
        firstName: "Youssef",
        lastName: "Khemiri",
        email: "youssef.khemiri@example.com",
        password: bcrypt.hashSync("Password123!", 8),
        telephone: "+21650000005",
        specialite: "General Practice",
        disponibilite: {
          lundi: ["08:00", "12:00"],
          mardi: ["08:00", "12:00"],
          wednesday: ["08:00", "12:00"],
          thursday: ["08:00", "12:00"],
          friday: ["08:00", "12:00"],
          saturday: ["09:00", "12:00"],
          dimanche: [],
        },
      },
    ];

    const createdDoctors = await Medecin.insertMany(
      doctorData.map((d) => ({ ...d, role: "medecin" }))
    );

    console.log(`Inserted ${createdDoctors.length} doctors.`);

    // --- Create Patients ---
    const patientData = [
      {
        firstName: "Lina",
        lastName: "Sassi",
        cin: "TN100001",
        email: "lina.sassi@example.com",
        password: bcrypt.hashSync("patientpass1", 8),
        telephone: "+21660000001",
        birthDate: new Date("1995-03-12"),
        address: "Ariana, Tunisia",
      },
      {
        firstName: "Rami",
        lastName: "Jemai",
        cin: "TN100002",
        email: "rami.jemai@example.com",
        password: bcrypt.hashSync("patientpass2", 8),
        telephone: "+21660000002",
        birthDate: new Date("1988-08-24"),
        address: "Tunis, Tunisia",
      },
      {
        firstName: "Maya",
        lastName: "Zribi",
        cin: "TN100003",
        email: "maya.zribi@example.com",
        password: bcrypt.hashSync("patientpass3", 8),
        telephone: "+21660000003",
        birthDate: new Date("2000-01-15"),
        address: "Sfax, Tunisia",
      },
      {
        firstName: "Omar",
        lastName: "Karaa",
        cin: "TN100004",
        email: "omar.karaa@example.com",
        password: bcrypt.hashSync("patientpass4", 8),
        telephone: "+21660000004",
        birthDate: new Date("1979-11-02"),
        address: "Bizerte, Tunisia",
      },
      {
        firstName: "Sara",
        lastName: "Maher",
        cin: "TN100005",
        email: "sara.maher@example.com",
        password: bcrypt.hashSync("patientpass5", 8),
        telephone: "+21660000005",
        birthDate: new Date("1992-06-30"),
        address: "Nabeul, Tunisia",
      },
      {
        firstName: "Nader",
        lastName: "Saidi",
        cin: "TN100006",
        email: "nader.saidi@example.com",
        password: bcrypt.hashSync("patientpass6", 8),
        telephone: "+21660000006",
        birthDate: new Date("1985-09-09"),
        address: "Gabes, Tunisia",
      },
      {
        firstName: "Imen",
        lastName: "Ben Youssef",
        cin: "TN100007",
        email: "imen.by@example.com",
        password: bcrypt.hashSync("patientpass7", 8),
        telephone: "+21660000007",
        birthDate: new Date("1998-04-17"),
        address: "Kairouan, Tunisia",
      },
      {
        firstName: "Sofiene",
        lastName: "Hmedi",
        cin: "TN100008",
        email: "sofiene.hmedi@example.com",
        password: bcrypt.hashSync("patientpass8", 8),
        telephone: "+21660000008",
        birthDate: new Date("1990-12-12"),
        address: "Monastir, Tunisia",
      },
      {
        firstName: "Rania",
        lastName: "Gharbi",
        cin: "TN100009",
        email: "rania.gharbi@example.com",
        password: bcrypt.hashSync("patientpass9", 8),
        telephone: "+21660000009",
        birthDate: new Date("2001-07-07"),
        address: "Kef, Tunisia",
      },
      {
        firstName: "Walid",
        lastName: "Zaghouani",
        cin: "TN100010",
        email: "walid.z@example.com",
        password: bcrypt.hashSync("patientpass10", 8),
        telephone: "+21660000010",
        birthDate: new Date("1975-02-02"),
        address: "Sousse, Tunisia",
      },
    ];

    const createdPatients = await Patient.insertMany(
      patientData.map((p) => ({ ...p, role: "patient" }))
    );

    console.log(`Inserted ${createdPatients.length} patients.`);

    // --- Create Appointments (RendezVous) ---
    // Spread appointments across doctors and patients; use different dates/times and statuses.
    const appointments = [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        time: "09:30",
        duration: 30,
        status: "scheduled",
        notes: "Initial consult",
        patientId: createdPatients[0]._id,
        medecinId: createdDoctors[0]._id,
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: "10:00",
        duration: 20,
        status: "scheduled",
        notes: "Skin check",
        patientId: createdPatients[1]._id,
        medecinId: createdDoctors[1]._id,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        time: "11:00",
        duration: 30,
        status: "completed",
        notes: "Follow-up",
        patientId: createdPatients[2]._id,
        medecinId: createdDoctors[2]._id,
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: "14:00",
        duration: 30,
        status: "scheduled",
        notes: "Neurology evaluation",
        patientId: createdPatients[3]._id,
        medecinId: createdDoctors[3]._id,
      },
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: "08:30",
        duration: 15,
        status: "scheduled",
        notes: "Quick check",
        patientId: createdPatients[4]._id,
        medecinId: createdDoctors[4]._id,
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: "15:00",
        duration: 30,
        status: "scheduled",
        notes: "Child vaccination",
        patientId: createdPatients[5]._id,
        medecinId: createdDoctors[2]._id,
      },
      {
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        time: "09:00",
        duration: 45,
        status: "completed",
        notes: "Cardio test",
        patientId: createdPatients[6]._id,
        medecinId: createdDoctors[0]._id,
      },
      {
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: "12:00",
        duration: 30,
        status: "scheduled",
        notes: "Dermatology",
        patientId: createdPatients[7]._id,
        medecinId: createdDoctors[1]._id,
      },
      {
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: "11:30",
        duration: 30,
        status: "scheduled",
        notes: "General consultation",
        patientId: createdPatients[8]._id,
        medecinId: createdDoctors[4]._id,
      },
      {
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: "16:00",
        duration: 60,
        status: "scheduled",
        notes: "Extended follow-up",
        patientId: createdPatients[9]._id,
        medecinId: createdDoctors[3]._id,
      },
    ];

    const createdAppointments = await RendezVous.insertMany(appointments);

    console.log(`Inserted ${createdAppointments.length} appointments.`);

    console.log("Seeding finished successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
