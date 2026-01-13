import { useState, useEffect } from "react";
import { Trash2, Edit, Eye } from "lucide-react";
import api from "../../services/api"; // Axios instance

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch patients from backend
  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await api.get("/admin/patients");
        setPatients(res.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  // Filter patients by search term and status
  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || (patient.status || "active") === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Delete patient
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await api.delete(`/admin/patients/${id}`);
        setPatients(patients.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const styles = {
    page: { maxWidth: 1200, margin: "0 auto", padding: 20, fontFamily: "Poppins, sans-serif", color: "#0f172a" },
    header: { marginBottom: 30 },
    headerTitle: { fontSize: 32, fontWeight: 700 },
    headerText: { color: "#64748b", marginTop: 6 },
    filters: { display: "flex", gap: 15, marginBottom: 20, flexWrap: "wrap" },
    filterItem: { display: "flex", flexDirection: "column", flex: 1, minWidth: 200 },
    filterInput: { padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, marginTop: 6 },
    filterButton: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#f3f4f6", cursor: "pointer", fontWeight: 500, marginTop: 22 },
    tableWrapper: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
    th: { textAlign: "left", padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" },
    td: { padding: "12px", borderBottom: "1px solid #e2e8f0" },
    badgeActive: { background: "#d1fae5", color: "#065f46", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 },
    badgeInactive: { background: "#e2e8f0", color: "#475569", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600 },
    actions: { display: "flex", gap: 8 },
    actionButton: { display: "flex", alignItems: "center", justifyContent: "center", padding: 6, borderRadius: 8, border: "none", cursor: "pointer", background: "#f3f4f6" },
    deleteButton: { background: "#fecaca", color: "#991b1b" },
    noData: { textAlign: "center", color: "#64748b", fontStyle: "italic", padding: 20 },
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 50 }}>Loading patients...</div>;
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Manage Patients</h1>
        <p style={styles.headerText}>View and manage all patient accounts</p>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterItem}>
          <label>Search Patient</label>
          <input
            type="text"
            placeholder="Name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.filterInput}
          />
        </div>
        <div style={styles.filterItem}>
          <label>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterInput}
          >
            <option value="all">All Patients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div style={styles.filterItem}>
          <button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} style={styles.filterButton}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>CIN</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Join Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td style={styles.td}>{patient.firstName} {patient.lastName}</td>
                  <td style={styles.td}>{patient.email}</td>
                  <td style={styles.td}>{patient.telephone || "-"}</td>
                  <td style={styles.td}>{patient.cin || "-"}</td>
                  <td style={styles.td}>
                    <span style={patient.status === "inactive" ? styles.badgeInactive : styles.badgeActive}>
                      {patient.status || "active"}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(patient.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.actionButton}><Eye size={16} /></button>
                      <button style={styles.actionButton}><Edit size={16} /></button>
                      <button style={{ ...styles.actionButton, ...styles.deleteButton }} onClick={() => handleDelete(patient._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={styles.noData}>No patients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
