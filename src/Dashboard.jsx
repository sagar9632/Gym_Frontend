import { useEffect, useState } from "react";
import "./assets/style.css";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
   const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeUsers: 0,
    expiredUsers: 0,
    todayEnrollments: 0,
    totalMembership: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

const cards = [
    {
      title: "Total Active Users",
      count: stats.activeUsers,
      color: "green",
      icon: "👤",
      path: "/dashboard/userlist"
    },
    {
      title: "Renewal Users",
      count: stats.expiredUsers,
      color: "red",
      icon: "🔄",
      path: "/dashboard/Renewal"
    },
    {
      title: "Today's Enrollment",
      count: stats.todayEnrollments,
      color: "light-green",
      icon: "👤"
      
    },
    {
      title: "Total Membership",
      count: stats.totalMembership,
      color: "blue",
      icon: "👤",
      path: "/dashboard/MembershipAdd"
    },
    {
      title: "Payment Pending",
      count: stats.pendingPayments,
      color: "purple",
      icon: "💳",
      path: "/dashboard/paymentpending"
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
      </header>

       <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`dashboard-card ${card.color}`}
            onClick={() => navigate(card.path)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.count}</h3>
            <p>{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
