import { useState, useEffect } from "react";
import api from "../services/api";
import "../css/AdminPage.css";
import { useNavigate } from "react-router-dom";

function AdminPage() {

  const [form, setForm] = useState({
    ownerName: "",
    phoneNumber: "",
    vehicleNumber: ""
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // ✅ Check login status on load
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("admin") === "true");
  }, []);

  const submit = async () => {
    if (!form.ownerName || !form.phoneNumber || !form.vehicleNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/add", form);

      // Download QR
     window.open(`www.owntag.in/api/qr/${res.data.uniqueCode}`);

      alert("✅ QR Generated Successfully!");

      setForm({
        ownerName: "",
        phoneNumber: "",
        vehicleNumber: ""
      });

    } catch (err) {
      alert("❌ Error generating QR");
    }
  };

  return (
    <div className="admin-bg">
      <div className="admin-container">

        <div className="admin-card">

          <h2>🚗 OwnTag </h2>
          <p className="subtitle">Create QR for new vehicle</p>

          <input
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={e => setForm({...form, ownerName: e.target.value})}
          />

          <input
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={e => setForm({...form, phoneNumber: e.target.value})}
          />

          <input
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={e => setForm({...form, vehicleNumber: e.target.value})}
          />

          <button onClick={submit}>
            Generate & Download QR
          </button>

          {/* 🔐 Show Login OR Dashboard based on state */}
          {!isLoggedIn && (
  <button
    className="login-btn"
    onClick={() => navigate("/login")}
  >
    🔐 Admin Login
  </button>
)}

        </div>

      </div>
    </div>
  );
}

export default AdminPage;