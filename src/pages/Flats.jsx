import Layout from "../components/Layout";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "./flats.css";

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [flatNumber, setFlatNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFlats = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "flats"));
    setFlats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const addFlat = async () => {
    if (!flatNumber.trim() || !ownerName.trim()) return;

    setSubmitting(true);
    await addDoc(collection(db, "flats"), {
      flatNumber: flatNumber.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      active: true,
      createdAt: Date.now(),
    });
    setFlatNumber("");
    setOwnerName("");
    setPhone("");
    await fetchFlats();
    setSubmitting(false);
  };

  const removeFlat = async (id) => {
    if (!window.confirm("Delete this flat permanently?")) return;
    await deleteDoc(doc(db, "flats", id));
    await fetchFlats();
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  return (
    <Layout>
      <div className="flats-root">

        {/* Header */}
        <header className="flats-header">
          <h1>Flats</h1>
          <p>Manage flat numbers, owners, and contact details</p>
        </header>

        {/* Add flat */}
        <section className="flats-form">
          <div className="field">
            <label>Flat number</label>
            <input
              placeholder="A-101"
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="field">
            <label>Owner name</label>
            <input
              placeholder="Owner full name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="field">
            <label>Phone (optional)</label>
            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button
            className="primary-btn"
            onClick={addFlat}
            disabled={submitting}
          >
            {submitting ? "Adding…" : "Add flat"}
          </button>
        </section>

        {/* List */}
       {/* List */}
<section className="flats-table">
  <div className="table-header">
    <span>{flats.length} flats</span>
    {loading && <span className="muted">Loading…</span>}
  </div>

  {flats.length === 0 ? (
    <div className="empty">
      No flats added yet
    </div>
  ) : (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Flat</th>
            <th>Owner</th>
            <th>Phone</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {flats.map(f => (
            <tr key={f.id}>
              <td>{f.flatNumber}</td>
              <td>{f.ownerName}</td>
              <td className="muted">{f.phone || "—"}</td>
              <td className="action">
                <button onClick={() => removeFlat(f.id)}>
                  Delete
                </button>
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
