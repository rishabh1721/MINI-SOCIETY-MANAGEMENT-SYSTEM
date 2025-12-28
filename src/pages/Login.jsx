import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return false;
    }
    return true;
  };

  const loginAsAdmin = async () => {
    if (!validate()) return;

    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", res.user.uid));

      if (!snap.exists()) {
        throw new Error("NO_PROFILE");
      }

      if (snap.data().role !== "ADMIN") {
        throw new Error("NOT_ADMIN");
      }

      navigate("/dashboard");
    } catch (e) {
      if (e.message === "NOT_ADMIN") {
        setError("This account is not an admin");
      } else {
        setError("Invalid admin credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsOwner = async () => {
    if (!validate()) return;

    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", res.user.uid));

      if (!snap.exists()) {
        throw new Error("NO_PROFILE");
      }

      if (snap.data().role !== "USER") {
        throw new Error("NOT_USER");
      }

      if (!snap.data().approved) {
        navigate("/pending");
        return;
      }

      navigate("/me");
    } catch (e) {
      if (e.message === "NOT_USER") {
        setError("This account is not a flat owner");
      } else {
        setError("Invalid owner credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Sushila Buildcon</h1>
        <p className="subtitle">Maintenance Portal</p>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className="actions">
          <button onClick={loginAsOwner} disabled={loading}>
            Login as Owner
          </button>

          <button
            className="admin"
            onClick={loginAsAdmin}
            disabled={loading}
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}