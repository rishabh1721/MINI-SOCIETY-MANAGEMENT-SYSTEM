import Layout from "../components/Layout";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "./payments.css";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [monthFilter, setMonthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "payments"));
    setPayments(
      snap.docs.map(d => ({ id: d.id, ...d.data() }))
    );
    setLoading(false);
  };

  const markPaid = async (id) => {
    if (!window.confirm("Mark this payment as PAID?")) return;

    await updateDoc(doc(db, "payments", id), {
      status: "PAID",
      paidOn: Date.now(),
      mode: "CASH",
    });

    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => {
    if (monthFilter && p.month !== monthFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <Layout>
      <div className="payments-root">

        {/* Header */}
        <header className="payments-header">
          <h1>Payments</h1>
          <p>Track and manage maintenance payments</p>
        </header>

        {/* Filters */}
        <section className="payments-filters">
          <div className="filter">
            <label>Month</label>
            <input
              type="month"
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
            />
          </div>

          <div className="filter">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>

          {(monthFilter || statusFilter) && (
            <button
              className="clear-filters"
              onClick={() => {
                setMonthFilter("");
                setStatusFilter("");
              }}
            >
              Clear
            </button>
          )}
        </section>

        {/* Table */}
        {/* Table */}
<section className="payments-table">
  <div className="table-header">
    <span>{filteredPayments.length} records</span>
    {loading && <span className="muted">Loading…</span>}
  </div>

  {filteredPayments.length === 0 ? (
    <div className="empty">No matching records</div>
  ) : (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Flat</th>
            <th>Amount</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map(p => (
            <tr key={p.id}>
              <td>{p.month}</td>
              <td>{p.flatNumber}</td>
              <td>₹{p.amount}</td>
              <td>
                <span className={`status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </td>
              <td className="action">
                {p.status === "UNPAID" && (
                  <button onClick={() => markPaid(p.id)}>
                    Mark paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>


      </div>
    </Layout>
  );
}
