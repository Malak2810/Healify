import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Stethoscope, Calendar, TrendingUp, ArrowRight, Settings } from "lucide-react";
import axios from "axios";
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    completionRate: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/admin/stats", {
          headers: { "x-access-token": localStorage.getItem("token") }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statList = [
    { icon: Users, label: "Total Patients", value: stats.totalPatients, detail: "Active accounts", color: "primary" },
    { icon: Stethoscope, label: "Total Doctors", value: stats.totalDoctors, detail: "Medical staff", color: "accent" },
    { icon: Calendar, label: "Total Appointments", value: stats.totalAppointments, detail: "All time", color: "primary" },
    { icon: TrendingUp, label: "Completion Rate", value: `${stats.completionRate}%`, detail: "Average", color: "accent" },
  ];

  const managementItems = [
    { title: "Manage Patients", description: "View, edit, and manage patient accounts", icon: Users, link: "/admin/patients", color: "primary" },
    { title: "Manage Doctors", description: "Add, edit, and manage doctor accounts", icon: Stethoscope, link: "/admin/doctors", color: "accent" },
    { title: "View Appointments", description: "Track and monitor all clinic appointments", icon: Calendar, link: "/admin/appointments", color: "primary" },
  ];

  return (
    <div className="Page">
      <div className="Inner">
        {/* Header */}
        <div className="Hero">
          <h1 className="HeroTitle">Admin Control Center</h1>
          <p className="HeroDesc">Manage clinic operations and system users</p>
        </div>

        {/* Stats grid */}
        <div className="StatsGrid">
          {statList.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="StatCard">
                <div className="StatTop">
                  <div className="StatLabel">{s.label}</div>
                  <div className={`IconWrap ${s.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="StatValue">{s.value}</div>
                <div className="StatDetail">{s.detail}</div>
              </div>
            );
          })}
        </div>

        {/* Management cards */}
        <div className="ManagementGrid">
          {managementItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="ManagementCard">
                <div className={`ManagementOverlay overlay-${item.color}`} />
                <div className="ManagementHeader">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className={`IconContainer ${item.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="ManagementTitle">{item.title}</div>
                  </div>
                  <div className="ManagementDesc">{item.description}</div>
                </div>
                <div className="ManagementFooter">
                  <Link to={item.link} style={{ width: "100%", textDecoration: "none" }}>
                    <button className="PrimaryButton">
                      Access Management <ArrowRight size={14} style={{ marginLeft: 8 }} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* System settings */}
        <div className="SettingsCard">
          <div className="SettingsHeader">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="SettingsIcon"><Settings size={18} /></div>
              <div className="SettingsTitle">System Settings</div>
            </div>
            <div className="SettingsDesc">Configure clinic operations and system preferences</div>
          </div>

          <div className="SettingsBody">
            <button className="ActionButtonOutline"><Settings size={14} style={{ marginRight: 8 }} /> Clinic Configuration</button>
            <button className="ActionButtonOutline"><Users size={14} style={{ marginRight: 8 }} /> Manage Users</button>
          </div>
        </div>
      </div>
    </div>
  );
}
