import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRout.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import Dashboard from "./Dashboard.jsx";
import EnrollUser from "./EnrollUser.jsx";
import MembershipAdd from "./MembershipAdd.jsx";
import PaymentPending from "./PaymentPending.jsx";
import RenewalUser from "./RenewalUser.jsx";
import UserList from "./UserList.jsx";
import RenewalForm from "./RenewalForm.jsx";
export default function App() {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default dashboard */}
        <Route index element={<Dashboard />} />

        {/* Dashboard Pages */}
        <Route path="MembershipAdd" element={<MembershipAdd />} />
        <Route path="enroll" element={<EnrollUser />} />
        <Route path="renewal" element={<RenewalUser />} />
        <Route path="PaymentPending" element={<PaymentPending />} />
         <Route path="userlist" element={<UserList />} />
        <Route path="RenewalForm" element={<RenewalForm />} />

      </Route>
    </Routes>
  );
}
