import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./assets/style.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function RenewalUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/renewal`)
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("API ERROR:", err));
  }, []);

  const handlePayClick = (user) => {
    if (!user) return;
    navigate("/Dashboard/RenewalForm", { state: { user } });
  };

  /* 🔍 SEARCH FILTER */
  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.Username?.toLowerCase().includes(query) ||
      user.Pno?.toString().includes(query) ||
      user.Mplan?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container">
      <header className="dashboard-header">
        <h2>Renewal User List</h2>
      </header>

      
      <div className="enroll-card">
        {/* 🔍 SEARCH INPUT */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Plan</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.Username}</td>
                  <td>{user.Pno}</td>
                  <td>{user.Mplan}</td>
                  <td>
                    {user.ExpDate
                      ? new Date(user.ExpDate)
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </td>
                  <td>
                    <button
                      className="renew-btn"
                      onClick={() => handlePayClick(user)}
                    >
                      Renew Now
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
