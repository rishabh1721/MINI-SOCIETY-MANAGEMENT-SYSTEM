import Layout from "../components/Layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    flats: 0,
    unpaid: 0,
    paid: 0,
    amountPending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const flatsSnap = await getDocs(collection(db, "flats"));
      const paymentsSnap = await getDocs(collection(db, "payments"));

      let unpaid = 0;
      let paid = 0;
      let pendingAmount = 0;

      paymentsSnap.docs.forEach((d) => {
        const p = d.data();
        if (p.status === "PAID") {
          paid++;
        } else {
          unpaid++;
          pendingAmount += Number(p.amount || 0);
        }
      });

      setStats({
        flats: flatsSnap.size,
        unpaid,
        paid,
        amountPending: pendingAmount,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="dashboard-page">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Society overview & maintenance summary</p>
        </header>

        {loading ? (
          <div className="dashboard-loading">Loading summary…</div>
        ) : (
          <div className="dashboard-grid">
            <StatCard title="Total Flats" value={stats.flats} />
            <StatCard title="Unpaid Dues" value={stats.unpaid} variant="danger" />
            <StatCard title="Paid Payments" value={stats.paid} variant="success" />
            <StatCard
              title="Pending Amount"
              value={`₹${stats.amountPending}`}
              variant="warning"
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ title, value, variant }) {
  return (
    <div className={`stat-card ${variant || ""}`}>
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
}