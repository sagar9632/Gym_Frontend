import { useState, useEffect } from "react";
import axios from "axios";
import "./assets/style.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const calculatedPending =
    selectedUser && payAmount
      ? Number(selectedUser.PendingAmt) - Number(payAmount)
      : selectedUser?.PendingAmt;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/userslist`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayClick = (user) => {
    setSelectedUser(user);
    setPayAmount("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handlePayNow = async () => {
    const paying = Number(payAmount);
    const pending = Number(selectedUser.PendingAmt);

    if (paying <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    if (paying > pending) {
      toast.error("Paying amount cannot exceed pending amount");
      setPayAmount("");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/updatepayment/${selectedUser.id}`,
        { payAmount: paying }
      );

      toast.success("Payment successful");
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
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
      <ToastContainer position="top-right" autoClose={2000} />

      <header className="dashboard-header">
        <h2>👥 User List</h2>
        <Link to="/dashboard/Enroll" className="userlist-link">
          <h4>Enroll User</h4>
        </Link>
      </header>

      {/* 🔍 SEARCH INPUT */}
      

      <div className="enroll-card">
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
              <th>Reg Date</th>
              <th>Expiry</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Pending</th>
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
                    {user.Date
                      ? new Date(user.Date).toISOString().split("T")[0]
                      : ""}
                  </td>
                  <td>
                    {user.ExpDate
                      ? new Date(user.ExpDate).toISOString().split("T")[0]
                      : ""}
                  </td>
                  <td>₹{user.TotalAmt}</td>
                  <td className="paid">₹{user.PaidAmt}</td>
                  <td className="pending">₹{user.PendingAmt}</td>
                  <td>
                    {Number(user.PendingAmt) > 0 && (
                      <button
                        className="btn pay"
                        onClick={() => handlePayClick(user)}
                      >
                        Pay
                      </button>
                    )}
                    <button className="btn print">Print</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 💰 PAYMENT MODAL */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>💰 Pay Amount</h3>

            <label>User Name</label>
            <input type="text" value={selectedUser.Username} readOnly />

            <label>Plan</label>
            <input type="text" value={selectedUser.Mplan} readOnly />

            <label>Total Amount</label>
            <input type="text" value={selectedUser.TotalAmt} readOnly />

            <label>Pending Amount</label>
            <input type="text" value={calculatedPending} readOnly />

            <label>Paying Amount</label>
            <input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="Enter paying amount"
            />

            <div className="modal-actions">
              <button className="btn pay" onClick={handlePayNow}>
                Pay Now
              </button>
              <button className="btn cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
