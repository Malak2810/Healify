// src/pages/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { Calendar, Stethoscope, FileText, Bell, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const [user, setUser] = useState({ name: "" });
  const [stats, setStats] = useState({ upcoming: 0, doctors: 0, records: 0 });
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return;
        const storedUser = JSON.parse(raw);
        setUser(storedUser);

        // Fetch Appointments
        const resAppointments = await api.get("/patient/rendez-vous");
        const dataAppointments = Array.isArray(resAppointments.data) ? resAppointments.data : [];
        const normalizedAppointments = dataAppointments.map((a) => {
          const dateVal = a.date ? new Date(a.date) : null;
          const timeVal = a.time || a.heure || "";
          const durationVal = a.duration ?? a.duree ?? 30;
          const med = a.medecinId || a.medecin || {};
          const medName = med.firstName || med.nom || med.name || "";
          const medLast = med.lastName || med.prenom || med.surname || "";
          return {
            ...a,
            _dateObj: dateVal,
            _timeStr: timeVal,
            _durationNum: Number(durationVal),
            _doctorDisplay: `${medName} ${medLast}`.trim() || "Doctor",
          };
        });
        setAppointments(normalizedAppointments);

        // Upcoming appointments count
        const now = new Date();
        const upcomingCount = normalizedAppointments.filter((a) => {
          if (!a._dateObj) return false;
          const [hh = "00", mm = "00"] = (a._timeStr || "").split(":");
          const combined = new Date(a._dateObj);
          combined.setHours(Number(hh), Number(mm), 0, 0);
          return combined >= now;
        }).length;

        // Days until next appointment
        const futureAppts = normalizedAppointments
          .map((a) => {
            if (!a._dateObj) return null;
            const [hh = "00", mm = "00"] = (a._timeStr || "").split(":");
            const dt = new Date(a._dateObj);
            dt.setHours(Number(hh), Number(mm), 0, 0);
            return dt >= now ? dt : null;
          })
          .filter(Boolean)
          .sort((x, y) => x - y);
        const nextInDays = futureAppts.length === 0 ? null : Math.ceil((futureAppts[0] - now) / (1000 * 60 * 60 * 24));

        // Doctors count
        const resDoctors = await api.get("/medecins");
        const doctorsCount = Array.isArray(resDoctors.data) ? resDoctors.data.length : 0;

        // Medical records
        const resRecords = await api.get("/patient/records");
        const dataRecords = Array.isArray(resRecords.data) ? resRecords.data : [];
        setRecords(dataRecords);

        setStats({
          upcoming: upcomingCount,
          doctors: doctorsCount,
          records: dataRecords.length,
          nextInDays,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name || "Patient"}</h1>
        <p>Manage your health appointments and medical profile</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Upcoming Appointments</h3>
          <div className="stat-icon"><Calendar className="h-5 w-5" /></div>
          <p className="stat-value">{stats.upcoming}</p>
          <p className="stat-subtitle">
            {stats.nextInDays === null
              ? "No upcoming appointments"
              : stats.nextInDays === 0
              ? "Today"
              : stats.nextInDays === 1
              ? "Tomorrow"
              : `Next in ${stats.nextInDays} days`}
          </p>
        </div>

        <div className="stat-card">
          <h3>Specialist Doctors</h3>
          <div className="stat-icon"><Stethoscope className="h-5 w-5" /></div>
          <p className="stat-value">{stats.doctors}</p>
          <p className="stat-subtitle">Available specialists</p>
        </div>

        <div className="stat-card">
          <h3>Medical Records</h3>
          <div className="stat-icon"><FileText className="h-5 w-5" /></div>
          <p className="stat-value">{stats.records}</p>
          <p className="stat-subtitle">Documents saved</p>

          {records.slice(0, 5).map((record) => (
            <div key={record._id || record.id} className="activity-item">
              <FileText className="h-4 w-4" />
              <div>
                <p>{record.title || "Untitled Record"}</p>
                <p className="activity-date">{record.date ? new Date(record.date).toLocaleDateString() : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions + Find Doctor Side by Side */}
      <div className="grid-cols-2 mb-12">
        <div className="card flex">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Quick Actions
          </h2>
          <p className="text-gray-600 mb-4">Manage your appointments</p>
          <Link to="/patient/appointments/new" className="button primary">
            Book New Appointment <ArrowRight className="inline ml-2 h-4 w-4" />
          </Link>
          <Link to="/patient/appointments" className="button outline">View All Appointments</Link>
          <Link to="/patient/profile" className="button outline">Update Profile</Link>
        </div>

        <div className="card flex">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Stethoscope className="h-5 w-5" /> Find a Doctor
          </h2>
          <p className="text-gray-600 mb-4">Search by specialty and availability</p>
          <Link to="/patient/search-doctors" className="button primary">Search Doctors</Link>
        </div>
      </div>
          <br /><br />
      <div className="card">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" /> Recent Activity
        </h2>
        <p className="text-gray-600 mb-4">Your latest appointments and notifications</p>
        {appointments.slice(0, 5).map((appt) => (
          <div key={appt._id || appt.id} className="activity-item">
            <Clock className="h-4 w-4" />
            <div>
              <p>
                Appointment with {appt._doctorDisplay} ({appt.status || appt.statut || "unknown"})
              </p>
              <p className="activity-date">
                {appt._dateObj ? appt._dateObj.toLocaleDateString() : ""} at {appt._timeStr || appt.time || appt.heure}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
