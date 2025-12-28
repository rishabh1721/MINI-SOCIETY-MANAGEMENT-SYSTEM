import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submit = async () => {
    const { name, flatNumber, phone, email, password } = form;

    if (!name || !flatNumber || !phone || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        role: "USER",
        approved: false,
        name,
        flatNumber,
        phone,
        email,
        createdAt: Date.now(),
      });

      navigate("/pending");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else {
        setError("Signup failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-root">
      <div className="signup-card">
        <h1>Owner Signup</h1>
        <p className="subtitle">
          Register your flat details. Access is granted after admin approval.
        </p>

        {error && <div className="error">{error}</div>}

        <input
          placeholder="Full Name"
          onChange={(e) => update("name", e.target.value)}
          disabled={loading}
        />

        <input
          placeholder="Flat Number (e.g. A-101)"
          onChange={(e) => update("flatNumber", e.target.value)}
          disabled={loading}
        />

        <input
          placeholder="Phone"
          onChange={(e) => update("phone", e.target.value)}
          disabled={loading}
        />

        <input
          placeholder="Email"
          onChange={(e) => update("email", e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          onChange={(e) => update("password", e.target.value)}
          disabled={loading}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}