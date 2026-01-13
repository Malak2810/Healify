import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import PatientDashboard from "./pages/patient/PatientDashboard";
import Appointments from "./pages/patient/Appointments";
import NewAppointment from "./pages/patient/NewAppointment";
import PatientProfilePage from "./pages/patient/PatientProfile";
import SearchDoctorsPage from "./pages/patient/SearchDoctors";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import DoctorsPage from "./pages/admin/DoctorsPage";
import PatientsPage from "./pages/admin/PatientsPage";
import DoctorAppointments from "./pages/medecin/DoctorAppointments";
import AvailabilityPage from "./pages/medecin/AvailabilityPage";
import DoctorProfilePage from "./pages/medecin/DoctorProfilePage";
import DoctorDashboard from "./pages/medecin/DoctorDashboard";

function App() {
  // Load user from localStorage on initial render
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Update state + localStorage together
  const setUserAndStorage = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUser(userData);
    
  };

  return (
    <BrowserRouter>
      <Navbar
        userType={user?.type}
        userName={user?.name}
        setUser={setUserAndStorage}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup setUser={setUserAndStorage} />} />
        <Route path="/login" element={<Login setUser={setUserAndStorage} />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<Appointments />} />
        <Route path="/patient/appointments/new" element={<NewAppointment />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
        <Route path="/patient/search-doctors" element={<SearchDoctorsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/appointments" element={<AppointmentsPage />} />
        <Route path="/admin/doctors" element={<DoctorsPage />} />
        <Route path="/admin/patients" element={<PatientsPage />} />
        <Route path="/medecin/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/availability" element={<AvailabilityPage />} />
        <Route path="/doctor/profile" element={<DoctorProfilePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}


export default App;
