import { useState, useEffect } from "react";
import axios from "axios";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/admin/appointments", {
          headers: {
            "x-access-token": localStorage.getItem("token"), // replace with your token storage
          },
        });
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = `${apt.patientName} ${apt.doctorName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled": return { background: "linear-gradient(90deg, #bfdbfe, #93c5fd)", color: "#1d4ed8" };
      case "completed": return { background: "linear-gradient(90deg, #d1fae5, #a7f3d0)", color: "#065f46" };
      case "canceled": return { background: "linear-gradient(90deg, #fecaca, #fca5a5)", color: "#991b1b" };
      default: return {};
    }
  };

  const styles = {
    page: { maxWidth: 1200, margin: "0 auto", padding: 20, fontFamily: "Poppins, sans-serif", color: "#0f172a" },
    headerTitle: { fontSize: 36, fontWeight: 700, marginBottom: 6 },
    headerText: { color: "#64748b", marginBottom: 30 },
    filters: { display: "flex", gap: 15, marginBottom: 30, flexWrap: "wrap" },
    filterItem: { display: "flex", flexDirection: "column", flex: 1, minWidth: 200 },
    filterInput: { padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, marginTop: 6 },
    filterButton: { padding: "10px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "white", fontWeight: 600, marginTop: 22, cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    filterButtonHover: { background: "#2563eb" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 },
    card: { borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "0.3s", cursor: "pointer", background: "linear-gradient(135deg, #f8fafc, #e2e8f0)", border: "1px solid #e2e8f0" },
    cardHover: { transform: "translateY(-6px)", boxShadow: "0 8px 20px rgba(0,0,0,0.12)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    cardTitle: { fontSize: 18, fontWeight: 600 },
    cardBodyText: { margin: "4px 0", fontSize: 14, color: "#334155" },
    cardFooterButton: { width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#0f172a", color: "white", fontWeight: 500, cursor: "pointer", transition: "0.2s" },
    cardFooterButtonHover: { background: "#1e293b" },
    noData: { textAlign: "center", color: "#64748b", fontStyle: "italic", gridColumn: "1 / -1" },
  };

  return (
    <div style={styles.page}>
      <header>
        <h1 style={styles.headerTitle}>All Appointments</h1>
        <p style={styles.headerText}>Monitor all clinic appointments</p>
      </header>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterItem}>
          <label>Search</label>
          <input
            type="text"
            placeholder="Patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterItem}>
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterInput}>
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div style={styles.filterItem}>
          <button
            onClick={resetFilters}
            style={styles.filterButton}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.filterButtonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "#3b82f6" })}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Appointments Grid */}
      <div style={styles.grid}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              style={styles.card}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "none" })}
            >
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{apt.patientName}</h2>
                <span
                  style={{
                    ...getStatusStyle(apt.status),
                    padding: "4px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
              <div>
                <p style={styles.cardBodyText}><strong>Doctor:</strong> {apt.doctorName}</p>
                <p style={styles.cardBodyText}><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                <p style={styles.cardBodyText}><strong>Time:</strong> {apt.time}</p>
              </div>
              <div style={{ marginTop: 12 }}>
                <button
                  style={styles.cardFooterButton}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardFooterButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "#0f172a" })}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noData}>No appointments found</div>
        )}
      </div>
    </div>
  );
}
