import "../assets/style.css";
import {
  FaTachometerAlt,
  FaIdCard,
  FaUserPlus,
  FaSync,
  FaCreditCard,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logout from "./Logout";
const API_URL = import.meta.env.VITE_API_URL;

export default function Sidebar({ isOpen, toggleSidebar, isMobile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });

      // Clear local storage if used
      localStorage.clear();
      sessionStorage.clear();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside
      className={`sidebar 
        ${isOpen ? "open" : "closed"} 
        ${isMobile ? "mobile" : ""}`}
    >
      {/* HEADER */}
      <div className="sidebar-header">
        <h2 className="logo">
          <span className="fitness">Fitness</span>
          <span className="pro">Pro</span>
        </h2>

        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      {/* MENU */}
      <nav className="menu">
        <NavLink to="/Dashboard" onClick={() => isMobile && toggleSidebar()}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/MembershipAdd" onClick={() => isMobile && toggleSidebar()}>
          <FaIdCard />
          <span>Membership</span>
        </NavLink>

        <NavLink to="/dashboard/Enroll" onClick={() => isMobile && toggleSidebar()}>
          <FaUserPlus />
          <span>Enroll User</span>
        </NavLink>

        <NavLink to="/dashboard/Renewal" onClick={() => isMobile && toggleSidebar()}>
          <FaSync />
          <span>Renewal</span>
        </NavLink>

        <NavLink to="/dashboard/paymentpending" onClick={() => isMobile && toggleSidebar()}>
          <FaCreditCard />
          <span>Payment</span>
        </NavLink>

        {/* LOGOUT */}
       <Logout />
      </nav>
    </aside>
  );
}
