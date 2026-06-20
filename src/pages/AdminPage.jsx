import { useState, useEffect } from "react";
import api from "../services/api";
import "../css/AdminPage.css";
import { useNavigate } from "react-router-dom";

function AdminPage() {

  const [form, setForm] = useState({
    ownerName: "",
    phoneNumber: "",
    vehicleNumber: "",
    address: ""
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("admin") === "true");
  }, []);

  // ✅ FINAL QR DOWNLOAD (ONLY QR)
  const submit = async () => {

    if (!form.ownerName || !form.phoneNumber || !form.vehicleNumber || !form.address) {
      setError("Please fill all fields");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      const res = await api.post("/add", form);

      const code = res.data.uniqueCode;

      // ✅ Clean filename
      const safeName = form.ownerName.replace(/[^a-zA-Z0-9]/g, "_");
      const safePhone = form.phoneNumber.replace(/\D/g, "");

      // ✅ Direct QR download from backend
      const link = document.createElement("a");
      link.href = `${api.defaults.baseURL}/qr/${code}`;
      link.download = `${safeName}_${safePhone}.png`;
      link.click();

      setMessage("✅ QR Generated & Downloaded!");

      // Reset form
      setForm({
        ownerName: "",
        phoneNumber: "",
        vehicleNumber: "",
        address: ""
      });

      setTimeout(() => setMessage(""), 2500);

    } catch {
      setError("❌ Error generating QR");
      setTimeout(() => setError(""), 2500);
    }
  };

  return (
    <>
      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      <div className="admin-bg">
        <div className="admin-container">

          <div className="admin-card">

            <h2>🚗 OwnTag</h2>
            <p className="subtitle">Create QR for new vehicle</p>

            <input
              className="text-black"
              placeholder="Owner Name"
              value={form.ownerName}
              onChange={e => setForm({ ...form, ownerName: e.target.value })}
            />

            <input
              className="text-black"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
            />

            <input
              className="text-black"
              placeholder="Vehicle Number"
              value={form.vehicleNumber}
              onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
            />

            <input
              className="text-black"
              placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />

            <button onClick={submit}>
              Generate & Download QR
            </button>

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
    </>
  );
}

export default AdminPage;