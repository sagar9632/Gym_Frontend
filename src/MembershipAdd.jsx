import { useEffect, useState } from "react";
import "./assets/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MembershipAdd() {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [memberships, setMemberships] = useState([]);

  // NEW STATES
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchMemberships = async () => {
    try {
      const res = await fetch(`${API_URL}/api/memberships`);
      const data = await res.json();
      setMemberships(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMemberships([]);
    }
  };

  // FETCH SINGLE MEMBERSHIP BY ID
  const fetchMembershipById = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/memberships/${id}`);
      const data = await res.json();

      setName(data.MName);
      setPlan(data.Plan);
      setAmount(data.Amount);
      setEditId(id);
      setIsEditing(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      // UPDATE
      await fetch(`${API_URL}/api/memberships/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, plan, amount }),
      });
      toast.success("Membership Plan Updated!");

    } else {
      // ADD
      await fetch(`${API_URL}/api/memberships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, plan, amount }),
      });
      toast.success("Membership Plan Added!");
    }

    // RESET FORM
    setName("");
    setPlan("");
    setAmount("");
    setEditId(null);
    setIsEditing(false);

    fetchMemberships();
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return (
    
    <div className="membership-container">
       <ToastContainer position="top-right" autoClose={2000} />
      <header className="dashboard-header">
        <h2>MEMBERSHIP</h2>
      </header>

      <div className="membership-grid">
        {/* Add / Edit Membership */}
        <div className="card">
          <h3>{isEditing ? "Edit Membership" : "Add Membership"}</h3>

          <form onSubmit={handleSubmit}>
            <label>Membership Name</label>
            <input
            placeholder="Enter Membership Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Plan</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} required>
              <option value="">Select Plan</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Month">3 Month</option>
              <option value="6 Month">6 Month</option>
              <option value="1 Year">1 Year</option>
            </select>

            <label>Amount</label>
            <input
            placeholder="Enter Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <button type="submit">
              {isEditing ? "UPDATE" : "ADD"}
            </button>
          </form>
        </div>

        {/* Membership List */}
        <div className="card">
          <h3>Membership List</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Membership Name</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.MName}</td>
                    <td>{item.Plan}</td>
                    <td>{item.Amount}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => fetchMembershipById(item.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
