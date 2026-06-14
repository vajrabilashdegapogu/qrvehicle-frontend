import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/VehiclePAge.css";

function VehiclePage() {

  const { code } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    vehicleNumber: ""
  });

  useEffect(() => {
    api.get(`/vehicle/${code}`)
      .then(res => setVehicle(res.data))
      .catch(err => console.error(err));
  }, [code]);

  const callNow = () => {
    window.location.href = `https://qrvehicle-backend-production.up.railway.app/api/call/${code}`;
    //  window.open(`https://qrvehicle-backend-production.up.railway.app/api/qr/${res.data.uniqueCode}`);
  };

  const whatsapp = () => {
    window.location.href = `https://qrvehicle-backend-production.up.railway.app/api/whatsapp/${code}`;
  };

  const submitOrder = async () => {

    if (!form.name || !form.phone || !form.address || !form.vehicleNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/order", {
        ...form,
        vehicleCode: code
      });

      alert("✅ Order placed successfully!");

      setForm({
        name: "",
        phone: "",
        address: "",
        vehicleNumber: ""
      });

      setShowForm(false);

    } catch (err) {
      alert("❌ Error placing order");
    }
  };

  if (!vehicle) return <h3 style={{textAlign:"center"}}>Loading...</h3>;

  return (
    <div className="main-bg">
      <div className="container">
        <div className="card">

          <h2>🚗 QR Vehicle</h2>

          <div style={{backgroundColor:"orange"}} className="vehicle-info">
            <p style={{color:"black"}}><b>Owner:</b> {vehicle.ownerName}</p>
            <p style={{color:"black"}}><b>Vehicle No:</b> {vehicle.vehicleNumber}</p>
          </div>

          <div className="buttons">
            <button style={{backgroundColor:"white", color:"blue"}} className="call" onClick={callNow}>📞 Call Now</button>
            <button style={{backgroundColor:"green"}} className="whatsapp" onClick={whatsapp}>💬 WhatsApp</button>
          </div>

          <hr />

          <p style={{color:"black"}}>Want your own QR sticker?</p>

          <button className="order" onClick={() => setShowForm(!showForm)}>
            🛒 Order QR Sticker
          </button>

          {showForm && (
            <div className="order-form">

              <input placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />

              <input placeholder="Phone Number"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />

              <textarea placeholder="Delivery Address"
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />

              <input placeholder="Vehicle Number"
                value={form.vehicleNumber}
                onChange={e => setForm({...form, vehicleNumber: e.target.value})}
              />

              <button style={{color:"black"}} onClick={submitOrder}>Submit Order</button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default VehiclePage;