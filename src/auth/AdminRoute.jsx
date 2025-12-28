import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}