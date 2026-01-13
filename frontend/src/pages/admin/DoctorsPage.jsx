// src/pages/admin/DoctorsPage.jsx
import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, X } from "lucide-react";
import api from "../../services/api";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    specialite: "",
    password: "",
    status: "active",
  });

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/medecins");
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (doctor.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const docStatus = doctor.status || "active";
    const matchesStatus = filterStatus === "all" || docStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Delete doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/admin/medecins/${id}`);
      alert("Doctor deleted successfully!");
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert(error.response?.data?.message || "Failed to delete doctor");
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (doctor = null) => {
    setEditingDoctor(doctor);
    if (doctor) {
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        email: doctor.email || "",
        telephone: doctor.telephone || "",
        specialite: doctor.specialite || doctor.specialty || "",
        password: "",
        status: doctor.status || "active",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        specialite: "",
        password: "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = (formData.firstName || "").trim();
    const lastName = (formData.lastName || "").trim();
    const email = (formData.email || "").trim();
    const telephone = (formData.telephone || "").trim();
    const specialite = (formData.specialite || "").trim();
    const password = (formData.password || "").trim();

    if (!firstName || !lastName || !email || !telephone || !specialite) {
      return alert("Please provide all required fields.");
    }
    if (!editingDoctor && !password) return alert("Password is required for new doctor.");

    const payload = { firstName, lastName, email, telephone, specialite };
    if (!editingDoctor || password.length > 0) payload.password = password;

    try {
      if (editingDoctor) {
        const res = await api.put(`/admin/medecins/${editingDoctor._id}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        const updatedDoc = res.data.medecin || { ...editingDoctor, ...payload };
        setDoctors((prev) => prev.map((d) => (d._id === editingDoctor._id ? updatedDoc : d)));
      } else {
        const res = await api.post("/admin/medecins", payload, {
          headers: { "Content-Type": "application/json" },
        });
        const created = res.data.medecin || res.data;
        setDoctors((prev) => [...prev, created]);
      }
      closeModal();
      alert(editingDoctor ? "Doctor updated successfully!" : "Doctor added successfully!");
    } catch (err) {
      console.error("Error saving doctor:", err);
      alert(err.response?.data?.message || "Failed to save doctor");
    }
  };

  const styles = {
    page: { maxWidth: 1200, margin: "0 auto", padding: 20, fontFamily: "Poppins, sans-serif", color: "#0f172a" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    headerTitle: { fontSize: 32, fontWeight: 700 },
    headerText: { color: "#64748b", marginTop: 6 },
    addButton: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontWeight: 600 },
    filters: { display: "flex", gap: 15, marginBottom: 20, flexWrap: "wrap" },
    filterItem: { display: "flex", flexDirection: "column", flex: 1, minWidth: 200 },
    filterInput: { padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, marginTop: 6 },
    filterButton: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#f3f4f6", cursor: "pointer", fontWeight: 500, marginTop: 22 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
    card: { borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "0.3s", background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer" },
    cardHover: { transform: "translateY(-6px)", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    cardTitle: { fontSize: 18, fontWeight: 600 },
    cardSub: { fontSize: 14, color: "#64748b", marginTop: 4 },
    cardContentText: { margin: "4px 0", fontSize: 14, color: "#334155" },
    cardFooter: { display: "flex", gap: 8, marginTop: 12 },
    cardButton: { flex: 1, padding: 8, borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 500, transition: "0.2s" },
    editButton: { background: "#f3f4f6" },
    deleteButton: { background: "#fecaca", color: "#991b1b" },
    badgeActive: { background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 },
    badgeInactive: { background: "#e2e8f0", color: "#475569", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 },
    noData: { textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1", padding: 20 },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { background: "white", borderRadius: 12, padding: 24, width: 400, maxWidth: "90%", position: "relative" },
    closeButton: { position: "absolute", top: 12, right: 12, border: "none", background: "none", cursor: "pointer" },
    formField: { display: "flex", flexDirection: "column", marginBottom: 12 },
    input: { padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 14 },
    submitButton: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", cursor: "pointer", fontWeight: 600 },
  };

  if (loading) return <div style={{ textAlign: "center", padding: 50 }}>Loading doctors...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Manage Doctors</h1>
          <p style={styles.headerText}>View and manage medical staff accounts</p>
        </div>
        <button style={styles.addButton} onClick={() => openModal()}><Plus size={16} />Add Doctor</button>
      </div>

      <div style={styles.filters}>
        <div style={styles.filterItem}>
          <label>Search Doctor</label>
          <input type="text" placeholder="Name, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.filterInput} />
        </div>
        <div style={styles.filterItem}>
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterInput}>
            <option value="all">All Doctors</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={styles.filterItem}>
          <button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} style={styles.filterButton}>Reset Filters</button>
        </div>
      </div>

      <div style={styles.grid}>
        {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
          <div key={doctor._id} style={styles.card}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "none" })}
          >
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Dr. {doctor.lastName}</h2>
                <p style={styles.cardSub}>{doctor.specialite || doctor.speciality || "-"}</p>
              </div>
              <span style={doctor.status === "inactive" ? styles.badgeInactive : styles.badgeActive}>{doctor.status || "active"}</span>
            </div>
            <div>
              <p style={styles.cardContentText}><strong>Email:</strong> {doctor.email}</p>
              <p style={styles.cardContentText}><strong>Phone:</strong> {doctor.telephone || doctor.phone || "-"}</p>
            </div>
            <div style={styles.cardFooter}>
              <button style={{ ...styles.cardButton, ...styles.editButton }} onClick={() => openModal(doctor)}><Edit size={16} />Edit</button>
              <button style={{ ...styles.cardButton, ...styles.deleteButton }} onClick={() => handleDelete(doctor._id)} disabled={deletingId === doctor._id}>
                <Trash2 size={16} />{deletingId === doctor._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )) : <div style={styles.noData}>No doctors found</div>}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeButton} onClick={closeModal}><X /></button>
            <h2>{editingDoctor ? "Edit Doctor" : "Add Doctor"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formField}>
                <label>First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} style={styles.input} required />
              </div>
              <div style={styles.formField}>
                <label>Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={styles.input} required />
              </div>
              <div style={styles.formField}>
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} required />
              </div>
              <div style={styles.formField}>
                <label>Telephone</label>
                <input type="text" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} style={styles.input} />
              </div>
              <div style={styles.formField}>
                <label>Specialite</label>
                <input type="text" value={formData.specialite} onChange={(e) => setFormData({ ...formData, specialite: e.target.value })} style={styles.input} />
              </div>
              <div style={styles.formField}>
                <label>{editingDoctor ? "Password (leave blank to keep current)" : "Password (required)"}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} required={!editingDoctor} />
              </div>
              <div style={styles.formField}>
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={styles.input}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" style={styles.submitButton}>{editingDoctor ? "Update Doctor" : "Add Doctor"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
