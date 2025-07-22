import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Logout from "../components/Logout";
import Signup from "../components/Signup.jsx";
import CusNavbar from "../components/Navbar.jsx";
import StudentDashboard from "../components/studentDashboard.jsx";
import Profile from "../components/Profile.jsx";
import RecruiterDashboard from "../components/recruiterDashboard.jsx";
import Home from "../components/Home.jsx";
import Jobs from "../components/Jobs.jsx";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: false, 
    });
  }, []);

  return (
    <BrowserRouter>
      <CusNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recruiterDashboard" element={<RecruiterDashboard />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
