import { useEffect, useState } from "react";
import "./assets/style.css";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const today = new Date().toISOString().split("T")[0];

export default function RenewalForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const renewalUser = location.state?.user;

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
    admissionFee: "0",
    totalAmount: "",
    payAmount: "",
    pendingAmount: "",
    paymentMode: "Cash",
    paymentstatus: "Pending",
  });

  const [memberships, setMemberships] = useState([]);

  // Prefill data from Renewal page
  useEffect(() => {
    if (!renewalUser) return;

    setForm((prev) => ({
      ...prev,
      id: renewalUser.id || "",
      name: renewalUser.Username || "",
      phone: renewalUser.Pno || "",
      gender: renewalUser.Gender || "",
      age: renewalUser.age || "",
      email: renewalUser.email || "",
     
    }));
  }, [renewalUser]);

  // Fetch memberships
  useEffect(() => {
    fetch(`${API_URL}/api/memberships`) 
      .then((res) => res.json())
      .then((data) => setMemberships(data));
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Set plan & amount
  useEffect(() => {
    if (!form.membership) return;

    const selected = memberships.find(
      (m) => m.MName === form.membership
    );

    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      plan: selected.Plan,
      amount: Number(selected.Amount),
    }));
  }, [form.membership, memberships]);

  // Calculate expiry
  useEffect(() => {
    if (!form.joinDate || !form.plan) return;

    const date = new Date(form.joinDate);
    const value = parseInt(form.plan);

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

  // Total & pending
  useEffect(() => {
    const total = Number(form.amount || 0) + Number(form.admissionFee || 0);
    const pending = total - Number(form.payAmount || 0);

    setForm((prev) => ({
      ...prev,
      totalAmount: total,
      pendingAmount: pending,
      paymentstatus: pending === 0 ? "Completed" : "Pending",
    }));
  }, [form.amount, form.admissionFee, form.payAmount]);

  // Submit
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/api/renewuser/${form.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Update failed");

   toast.success("Membership Renewed Successfully", {
  onClose: () => navigate("/dashboard/userlist"),
});
  
  } catch (err) {
    console.error(err);
    toast.error("Renewal failed");
  }
};


  return (
     <div className="enroll-container">
       <ToastContainer position="top-right" autoClose={1000} />
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
               name="id"
               value={form.id}
               onChange={handleChange}
               type="hidden"
             />
             <input
               name="name"
               value={form.name}
               onChange={handleChange}
               placeholder="Enter User Name"
               required
               readOnly
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
               readOnly
             />
           </div>
 
           <div className="field">
             <label>Gender</label>
             <select
               name="gender"
               value={form.gender}
               onChange={handleChange}
               required
               readOnly
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
               readOnly
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
               readOnly
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
             <label>Total Amount</label>
             <input
               min="0"
               name="admissionFee" type="hidden"
               value={form.admissionFee}
               placeholder="Enter Admission Fee"
               onChange={handleChange}
             />
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
                      .renewnow{
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
 
          <button className="renewnow">Renew</button> 
       </form>
     </div>
   );
 }
 