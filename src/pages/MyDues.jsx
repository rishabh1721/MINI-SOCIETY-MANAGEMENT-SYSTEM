import Layout from "../components/Layout";
import { useAuth } from "../auth/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "./mydues.css";

export default function MyDues() {
  const { user } = useAuth();

  const [payments, setPayments] = useState([]);
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let alive = true;

    const fetchMyData = async () => {
      setLoading(true);

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) {
        alive && setLoading(false);
        return;
      }

      const flatId = userSnap.data().flatId;
      if (!flatId) {
        alive && setLoading(false);
        return;
      }

      const flatSnap = await getDoc(doc(db, "flats", flatId));
      if (flatSnap.exists()) {
        alive && setFlat(flatSnap.data());
      }

      const q = query(
        collection(db, "payments"),
        where("flatId", "==", flatId)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.month || "").localeCompare(a.month || ""));

      alive && setPayments(data);
      alive && setLoading(false);
    };

    fetchMyData();

    return () => {
      alive = false;
    };
  }, [user]);

  const unpaid = payments.filter(p => p.status === "UNPAID");
  const paid = payments.filter(p => p.status === "PAID");

  return (
    <Layout>
      <div className="mydues-root">
        <header className="mydues-header">
          <h1>My Maintenance</h1>
          <p>Your dues and payment history</p>
        </header>

        {loading ? (
          <div className="mydues-loading">Loading your data…</div>
        ) : !flat ? (
          <div className="mydues-empty">
            <h3>Account not linked</h3>
            <p>
              Your account is not linked to a flat yet.
              <br />
              Please contact the society administrator.
            </p>
          </div>
        ) : (
          <>
            <section className="mydues-flat">
              <div>
                <span className="label">Flat</span>
                <strong>{flat.flatNumber}</strong>
              </div>
              <div>
                <span className="label">Owner</span>
                <strong>{flat.ownerName}</strong>
              </div>
            </section>

            <section className="mydues-summary">
              <SummaryCard title="Unpaid Dues" value={unpaid.length} accent="red" />
              <SummaryCard title="Paid Months" value={paid.length} accent="green" />
            </section>

            <section className="mydues-table">
              <h3>Payment History</h3>

              {payments.length === 0 ? (
                <div className="mydues-empty">No payments found</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td>{p.month}</td>
                        <td>₹{p.amount}</td>
                        <td>
                          <span className={`status ${p.status.toLowerCase()}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}

function SummaryCard({ title, value, accent }) {
  return (
    <div className={`summary-card ${accent}`}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}