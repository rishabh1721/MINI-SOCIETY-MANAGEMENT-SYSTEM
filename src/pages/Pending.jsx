import Layout from "../components/Layout";
import "./pending.css";

export default function Pending() {
  return (
    <Layout>
      <div className="pending-root">
        <div className="pending-card">
          <h2>Approval Pending</h2>

          <p className="pending-text">
            Your account has been created successfully.
            <br />
            It is currently awaiting approval from the society administrator.
          </p>

          <p className="pending-sub">
            You will get access automatically once approved.
          </p>
        </div>
      </div>
    </Layout>
  );
}