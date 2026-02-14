import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Login.css";
//import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL;
//console.log('API URL:', import.meta.env.VITE_API_URL);

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res = await axios.post(`${API_URL}/api/login`, form);
      // ✅ START SESSION
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>
          <span>Fitness</span> Pro
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">LOG-IN</button>
        </form>
      </div>
    </div>
  );
}
