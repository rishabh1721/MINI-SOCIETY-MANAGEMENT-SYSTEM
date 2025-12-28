import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./approveusers.css";

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  const load = async () => {
    setLoading(true);

    const usersSnap = await getDocs(collection(db, "users"));
    const flatsSnap = await getDocs(collection(db, "flats"));

    const pendingUsers = usersSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(u => u.role === "USER" && u.approved === false);

    const allFlats = flatsSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    setUsers(pendingUsers);
    setFlats(allFlats);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (user, flatId) => {
    if (!flatId) return;

    setAssigning(user.id);

    const flat = flats.find(f => f.id === flatId);

    await updateDoc(doc(db, "users", user.id), {
      approved: true,
      flatId,
    });

    await updateDoc(doc(db, "flats", flatId), {
      ownerName: user.name,
    });

    setAssigning(null);
    load();
  };

  return (
    <Layout>
      <div className="approve-root">
        <header className="approve-header">
          <h1>Approve Owners</h1>
          <p>Review and approve flat owner registrations</p>
        </header>

        {loading ? (
          <div className="approve-loading">Loading requests…</div>
        ) : users.length === 0 ? (
          <div className="approve-empty">No pending requests</div>
        ) : (
          <div className="approve-list">
            {users.map(u => (
              <div key={u.id} className="approve-card">
                <div className="approve-info">
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                  <span>Requested flat: {u.flatNumber}</span>
                </div>

                <div className="approve-actions">
                  <select
                    defaultValue=""
                    onChange={e => approve(u, e.target.value)}
                    disabled={assigning === u.id}
                  >
                    <option value="">Assign flat…</option>
                    {flats.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.flatNumber}
                      </option>
                    ))}
                  </select>

                  {assigning === u.id && (
                    <span className="assigning">Approving…</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}