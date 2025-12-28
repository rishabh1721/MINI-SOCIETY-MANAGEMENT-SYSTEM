import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function UserRoute({ children }) {
  const { loading, user, isUser, approved } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/" replace />;

  if (!isUser) return <Navigate to="/" replace />;

  if (!approved) return <Navigate to="/pending" replace />;

  return children;
}