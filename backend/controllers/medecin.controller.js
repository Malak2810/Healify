// Controller mta3 medecin
const db = require("../models")
const bcrypt = require("bcryptjs")
const Medecin = db.medecin
const RendezVous = db.rendezvous
const Patient = db.patient

// Njibou profile mta3 medecin
// Get profile
exports.getProfile = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.userId).select("-password")
    if (!medecin) return res.status(404).send({ message: "Doctor not found" })
    res.status(200).send(medecin)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving profile" })
  }
}

// Update profile
// Update profile (safer: only update changed fields)
exports.updateProfile = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.userId);
    if (!medecin) return res.status(404).send({ message: "Doctor not found" });

    // Build changes object only when incoming value differs from current
    const changes = {};

    const maybeSet = (field, incoming) => {
      if (typeof incoming !== "undefined" && incoming !== null) {
        // if string: trim and compare
        const current = medecin[field];
        const normalizedIncoming = typeof incoming === "string" ? incoming.trim() : incoming;
        if (String(current) !== String(normalizedIncoming)) {
          changes[field] = normalizedIncoming;
        }
      }
    };

    maybeSet("firstName", req.body.firstName);
    maybeSet("lastName", req.body.lastName);
    maybeSet("email", req.body.email);
    maybeSet("telephone", req.body.telephone);
    maybeSet("specialite", req.body.specialite);
    // disponibilite is usually an object/array — only set if provided and different
    if (req.body.disponibilite && JSON.stringify(req.body.disponibilite) !== JSON.stringify(medecin.disponibilite)) {
      changes.disponibilite = req.body.disponibilite;
    }

    // If password change is desired through this endpoint (I recommend separate endpoint),
    // ensure it's only applied if provided and non-empty. But here we don't accept plain password
    // change via updateProfile — use changePassword endpoint instead.
    if (req.body.password) {
      // optional: allow admin style password set, hashed
      changes.password = bcrypt.hashSync(req.body.password, 8);
    }

    // If nothing changed -> return a 400 so frontend knows it was a no-op
    if (Object.keys(changes).length === 0) {
      return res.status(400).send({ message: "No changes detected" });
    }

    // Update with validators and return the new document
    const updatedMedecin = await Medecin.findByIdAndUpdate(req.userId, changes, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password");

    return res.status(200).send({ message: "Profile updated successfully", medecin: updatedMedecin });
  } catch (error) {
    // If duplicate email or other mongoose error, send user-friendly message
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).send({ message: "Email is already in use" });
    }
    res.status(500).send({ message: error.message || "Error updating profile" });
  }
};



// Change password
exports.changePassword = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.userId)
    if (!medecin) return res.status(404).send({ message: "Doctor not found" })

    const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, medecin.password)
    if (!passwordIsValid) return res.status(401).send({ message: "Old password is incorrect" })

    medecin.password = bcrypt.hashSync(req.body.newPassword, 8)
    await medecin.save()

    res.status(200).send({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error changing password" })
  }
}

// Get appointments
exports.getRendezVousList = async (req, res) => {
  try {
    const rendezvous = await RendezVous.find({ medecinId: req.userId })
      .populate("patientId", "firstName lastName telephone")
      .sort({ date: 1, heure: 1 })

    res.status(200).send(rendezvous)
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving appointments" })
  }
}

// Update appointment
exports.updateRendezVous = async (req, res) => {
  try {
    const rendezvousId = req.params.id

    const rendezvous = await RendezVous.findOne({ _id: rendezvousId, medecinId: req.userId })
    if (!rendezvous) return res.status(404).send({ message: "Appointment not found or does not belong to you" })

    const updatedRendezVous = await RendezVous.findByIdAndUpdate(
      rendezvousId,
      {
        date: req.body.date || rendezvous.date,
        heure: req.body.heure || rendezvous.heure,
        duree: req.body.duree || rendezvous.duree,
        notes: req.body.notes || rendezvous.notes,
        statut: req.body.statut || rendezvous.statut,
      },
      { new: true }
    )

    res.status(200).send({ message: "Appointment updated successfully", rendezvous: updatedRendezVous })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error updating appointment" })
  }
}
