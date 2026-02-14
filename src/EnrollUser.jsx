import { useEffect, useState } from "react";
import "./assets/style.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const API_URL = import.meta.env.VITE_API_URL;


// helper to get today's date in YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];


export default function EnrollUser() {
   const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    age: "",
    joinDate: today,
    email: "",
    membership: "",
    plan: "",
    amount: "",
    expiryDate: "",
    admissionFee: "",
    totalAmount: "",
    payAmount: "",
    pendingAmount: "",
    paymentMode: "Cash",
    paymentstatus: "Pending",
  });
  console.log(form);


  const [memberships, setMemberships] = useState([]);

  // Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      const res = await fetch(`${API_URL}/api/memberships`);

      const data = await res.json();
      setMemberships(data);
    };
    fetchMemberships();
  }, []);

  // Handle input changes
 const handleChange = (e) => {
  const { name, value } = e.target;

  const numericFields = ["age", "admissionFee", "payAmount"];

  setForm((prev) => ({
    ...prev,
    [name]: numericFields.includes(name)
      ? value === ""          // if input is empty, keep it empty
        ? ""
        : Number(value)       // otherwise convert to number
      : value,
  }));
};


  // When membership is selected → set plan & amount
  useEffect(() => {
    if (!form.membership) {
      setForm((prev) => ({ ...prev, plan: "", amount: 0 }));
      return;
    }

    const selectedMembership = memberships.find(
      (m) => m.MName === form.membership
    );

    if (!selectedMembership) return;

    setForm((prev) => ({
      ...prev,
      plan: selectedMembership.Plan,
      amount: Number(selectedMembership.Amount),
    }));
  }, [form.membership, memberships]);

  // Calculate expiry date
  useEffect(() => {
    if (!form.joinDate || !form.plan) {
      setForm((prev) => ({ ...prev, expiryDate: "" }));
      return;
    }

    const date = new Date(form.joinDate);
    const value = parseInt(form.plan); // extract number from plan

    if (isNaN(value)) return;

    if (form.plan.toLowerCase().includes("month")) {
      date.setMonth(date.getMonth() + value);
    } else if (form.plan.toLowerCase().includes("year")) {
      date.setFullYear(date.getFullYear() + value);
    }

    setForm((prev) => ({
      ...prev,
      expiryDate: date.toISOString().split("T")[0],
    }));
  }, [form.joinDate, form.plan]);

  // Calculate total and pending amounts
  useEffect(() => {
    const total = Number(form.amount || 0) + Number(form.admissionFee || 0);
    const pending = total - Number(form.payAmount || 0);

    setForm((prev) => ({
      ...prev,
      totalAmount: total,
      pendingAmount: pending,
      paymentstatus: pending === 0 ? "Completed" : "Pending"  // <-- update here
    }));
  }, [form.amount, form.admissionFee, form.payAmount]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
       toast.success("Membership Renewed Successfully", {
          onClose: () => navigate("/dashboard/userlist"),
        });
      // Reset form if needed
      setForm({
        name: "",
        phone: "",
        gender: "",
        age: "",
         joinDate: today,
        membership: "",
        plan: "",
        amount: "",
        expiryDate: "",
        admissionFee: "",
        totalAmount:"",
        payAmount: "",
        pendingAmount: "",
        paymentMode: "Cash",
        paymentstatus: ""
      });
    } catch (err) {
      console.error(err);
      toast.error("Membership Plan Added!");

    }
  };

  return (
    <div className="enroll-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <header className="dashboard-header">
        <h2>ENROLL USER</h2>
        <Link to="/dashboard/userlist" className="userlist-link">
          <h4>USER LIST</h4>
        </Link>
      </header>

      <form className="enroll-card" onSubmit={handleSubmit}>
        <h3>User Details</h3>
        <div className="grid">
          <div className="field">
            <label>User Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter User Name"
              required
            />
          </div>

          <div className="field">
            <label>Phone Number</label>
            <input
              type="number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>

          <div className="field">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="field">
            <label>Age</label>
            <input
              type="number"
              name="age" required
              value={form.age}
              onChange={handleChange}
              placeholder="Enter Age"
            />
          </div>

       <div className="field">
          <label>Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            min={today}        // 🚫 disables yesterday & past dates
            onChange={handleChange}
            required
          />
        </div>
        <div className="field">
            <label>E-Mail</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </div>
        </div>
       
<br/>
 <hr/>
        <h3>Membership & Payment</h3>
        <div className="grid">
          <div className="field">
            <label>Membership</label>
            <select
              name="membership"
              value={form.membership}
              onChange={handleChange}
              required
            >
              <option value="">Select Membership</option>
              {memberships.map((m) => (
                <option key={m.id} value={m.MName}>
                  {m.MName}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Plan</label>
            <input value={form.plan} disabled />
          </div>

          <div className="field">
            <label>Membership Amount</label>
            <input value={form.amount} disabled required />
          </div>

          <div className="field">
            <label>Expiry Date</label>
            <input value={form.expiryDate} disabled required />
          </div>

          <div className="field">
            <label>Admission Fee</label>
            <input
              type="number"
              min="0"
              name="admissionFee" required
              value={form.admissionFee}
              placeholder="Enter Admission Fee"
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Total Amount</label>
            <input value={form.totalAmount} required disabled />
          </div>

          <div className="field">
            <label>Pay Amount</label>
            <input
              type="number"
              min="0"
              name="payAmount" required
              value={form.payAmount}
              onChange={handleChange}
            />
           {(Number(form.payAmount) === 0 ||
            Number(form.payAmount) > Number(form.totalAmount)) && (
                <>
                  <style>
                    {`
                      .enroll-btn {
                        display:none;
                      }
                    `}
                  </style>
                  <span className="error">
                    Pay amount must be greater than 0 and not exceed pending amount
                  </span>
                </>
              )}
          </div>

          <div className="field">
            <label>Pending Amount</label>
            <input value={form.pendingAmount} disabled required />
            <input type="hidden" name="paymentstatus" value={form.paymentstatus} />
          </div>

          <div className="field">
            <label>Payment Mode</label>
            <select
              name="paymentMode" required
              value={form.paymentMode}
              onChange={handleChange}
            >
              <option>Cash</option>
              <option>UPI</option>
            </select>
          </div>
        </div>

        <button className="enroll-btn">Enroll Now</button>
      </form>
    </div>
  );
}
