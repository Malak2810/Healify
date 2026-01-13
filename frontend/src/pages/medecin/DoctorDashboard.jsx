import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Clock, AlertCircle, CheckCircle, Info, Phone } from 'lucide-react';
import api from '../../services/api';
import './DoctorDashboard.css';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return '#16a34a';
    case 'scheduled': return '#3b82f6';
    case 'canceled': return '#facc15';
    default: return '#ccc';
  }
};

export default function DoctorDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/medecin/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/medecin/rendez-vous');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  const stats = [
    {
      icon: Calendar,
      label: "Today's Appointments",
      value: appointments.length,
      detail: `${appointments.filter(a => a.status === 'scheduled').length} scheduled`,
    },
    { icon: Users, label: 'This Week', value: '-', detail: 'Total consultations' },
    { icon: Users, label: 'Total Patients', value: '-', detail: 'Active patients' },
    { icon: TrendingUp, label: 'Completion Rate', value: '-', detail: 'Average' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome, Dr. {profile?.firstName}</h1>
        <p>Manage your consultations and patient care</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={i}>
              <div className="stat-header">
                <h3>{stat.label}</h3>
                <div className="stat-icon"><Icon size={18} /></div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-subtitle">{stat.detail}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="doctor-main-grid">
        {/* Left column: Today's Appointments */}
        <div className="card todays-appointments-card">
          <div className="card-header">
            <div><Calendar size={16} /> Today's Appointments</div>
            <a href="/doctor/appointments">View All</a>
          </div>

          {appointments.map((apt) => (
            <div className="appointment-card" key={apt._id}>
              <div
                className="status-stripe"
                style={{ backgroundColor: getStatusColor(apt.status) }}
              />
              <div className="appointment-content">
                <div className="appointment-left">
                  <div className="patient-name">{apt.patientId.firstName} {apt.patientId.lastName}</div>
                  {apt.specialty && (
                    <div className="appointment-specialty">{apt.specialty}</div>
                  )}
                </div>
                <div className="appointment-right">
                  <div className="appointment-info">
                    <Clock size={14} /> {apt.time} | Duration: {apt.duration || 30} min
                  </div>
                  <div className="appointment-info">
                    <Phone size={14} /> {apt.patientId.telephone || '-'}
                  </div>
                  {apt.notes && (
                    <div className="appointment-info">
                      <Info size={14} /> {apt.notes}
                    </div>
                  )}
                </div>
                <div
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(apt.status),
                    color: '#fff'
                  }}
                >
                  {apt.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: quick actions */}
        <div className="card flex">
          <div className="card-header">
            <div>Quick Actions</div>
            <div className="subtitle">Manage your profile</div>
          </div>
          <div className="quick-actions">
            <a href="/doctor/appointments" className="quick-button"><Calendar size={16} /> View Appointments</a>
            <a href="/doctor/profile" className="quick-button"><Users size={16} /> Edit Profile</a>
            <a href="/doctor/availability" className="quick-button"><Clock size={16} /> Set Availability</a>
          </div>
        </div>
      </div>
    </div>
  );
}
