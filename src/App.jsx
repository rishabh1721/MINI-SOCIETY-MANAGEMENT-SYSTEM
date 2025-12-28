import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Pending from "./pages/Pending";
import Dashboard from "./pages/Dashboard";
import Flats from "./pages/Flats";
import Maintenance from "./pages/Maintenance";
import Payments from "./pages/Payments";
import MyDues from "./pages/MyDues";
import ApproveUsers from "./pages/ApproveUsers";


// Route guards
import AdminRoute from "./auth/AdminRoute";
import UserRoute from "./auth/UserRoute";

function AppRoutes() {
  const { loading } = useAuth();

  // ⛔ CRITICAL: prevents white screen while auth loads
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading application…
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/pending" element={<Pending />} />

      {/* Admin */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/flats"
        element={
          <AdminRoute>
            <Flats />
          </AdminRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <AdminRoute>
            <Maintenance />
          </AdminRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <AdminRoute>
            <Payments />
          </AdminRoute>
        }
      />
      <Route
        path="/approve-users"
        element={
          <AdminRoute>
            <ApproveUsers />
          </AdminRoute>
        }
      />

      {/* Flat Owner */}
      <Route
        path="/my-dues"
        element={
          <UserRoute>
            <MyDues />
          </UserRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}