import Layout from "../components/Layout";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import "./maintenance.css";

export default function Maintenance() {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generateMaintenance = async () => {
    if (!month || !amount) {
      setMessage("Month and amount are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const flatsSnap = await getDocs(collection(db, "flats"));

      for (const flat of flatsSnap.docs) {
        await addDoc(collection(db, "payments"), {
          flatId: flat.id,
          flatNumber: flat.data().flatNumber,
          month,
          amount: Number(amount),
          status: "UNPAID",
          paidOn: null,
          mode: null,
          createdAt: Date.now(),
        });
      }

      setMessage("Maintenance generated successfully");
      setMonth("");
      setAmount("");
    } catch (err) {
      setMessage("Failed to generate maintenance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="maintenance-root">
        
        <header className="maintenance-header">
          <h1>Maintenance</h1>
          <p>Generate monthly maintenance for all flats</p>
        </header>

        <section className="maintenance-panel">
          
          {message && (
            <div className="maintenance-message">
              {message}
            </div>
          )}

          <div className="maintenance-form">
            <div className="field">
              <label>Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className="primary-btn"
              onClick={generateMaintenance}
              disabled={loading}
            >
              {loading ? "Generating…" : "Generate Maintenance"}
            </button>
          </div>

        </section>

      </div>
    </Layout>
  );
}
