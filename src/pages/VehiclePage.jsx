import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/VehiclePAge.css";

function VehiclePage() {

  const { code } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    vehicleNumber: ""
  });

  // ✅ FIX: FORCE REFRESH + CLEAR OLD DATA
  useEffect(() => {
  let isMounted = true;

  setVehicle(null); // clear old data

  api.get(`/vehicle/${code}`, {
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    },
    params: {
      t: Date.now() // force unique request
    }
  })
  .then(res => {
    if (isMounted) {
      setVehicle(res.data);
    }
  })
  .catch(err => {
    console.error(err);
  });

  return () => {
    isMounted = false;
  };

}, [code]);
console.log("Loaded code:", code);

  const callNow = () => {
    setMessage("📞 Connecting call...");
    setTimeout(() => {
      window.location.href = `${api.defaults.baseURL}/call/${code}`;
    }, 800);
  };

  const whatsapp = () => {
    setMessage("Opening WhatsApp...");
    setTimeout(() => {
      window.location.href = `${api.defaults.baseURL}/whatsapp/${code}`;
    }, 800);
  };

  const submitOrder = async () => {

    if (!form.name || !form.phone || !form.address || !form.vehicleNumber) {
      setError("Please fill all fields");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      await api.post("/order", {
        ...form,
        vehicleCode: code
      });

      setMessage("✅ Order placed successfully!");

      setForm({
        name: "",
        phone: "",
        address: "",
        vehicleNumber: ""
      });

      setShowForm(false);

      setTimeout(() => setMessage(""), 2500);

    } catch {
      setError("❌ Error placing order");
      setTimeout(() => setError(""), 2500);
    }
  };

  if (!vehicle) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

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

      <div className="main-bg">
        <div className="container">
          <div className="card">

            <h2>🚗 QR Vehicle</h2>

            <div style={{ backgroundColor: "orange" }} className="vehicle-info">
              <p style={{ color: "black" }}>
                <b>Owner:</b> {vehicle.ownerName}
              </p>
              <p style={{ color: "black" }}>
                <b>Vehicle No:</b> {vehicle.vehicleNumber}
              </p>
            </div>

            <div className="buttons">
              <button style={{ backgroundColor: "white", color: "blue" }} onClick={callNow}>
                📞 Call Now
              </button>
              <button style={{ backgroundColor: "green" }} onClick={whatsapp}>
                💬 WhatsApp
              </button>
            </div>

            <hr />

            <p style={{ color: "black" }}>Want your own QR sticker?</p>

            <button className="order" onClick={() => setShowForm(!showForm)}>
              🛒 Order QR Sticker
            </button>

            {showForm && (
              <div className="order-form">

                <input
                  className="text-black"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <input
                  className="text-black"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />

                <textarea
                  className="text-black"
                  placeholder="Delivery Address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />

                <input
                  className="text-black"
                  placeholder="Vehicle Number"
                  value={form.vehicleNumber}
                  onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
                />

                <button style={{ color: "black" }} onClick={submitOrder}>
                  Submit Order
                </button>

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default VehiclePage;

