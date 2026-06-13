import { useState } from "react";
import api from "../services/api";

function CreateQRPage() {

  const [form, setForm] = useState({
    ownerName: "",
    phoneNumber: "",
    vehicleNumber: ""
  });

  const submit = async () => {
    try {
      const res = await api.post("/add", form);

      // Open QR download
      window.open(`http://localhost:8080/api/qr/${res.data.uniqueCode}`);

      alert("✅ QR Generated!");

    } catch (err) {
      alert("❌ Error generating QR");
    }
  };

  return (
    <div style={{textAlign:"center"}}>
      <h2>🚗 Get Your QR</h2>

      <input placeholder="Your Name"
        onChange={e => setForm({...form, ownerName: e.target.value})} />

      <input placeholder="Phone Number"
        onChange={e => setForm({...form, phoneNumber: e.target.value})} />

      <input placeholder="Vehicle Number"
        onChange={e => setForm({...form, vehicleNumber: e.target.value})} />

      <button onClick={submit}>Generate QR</button>
    </div>
  );
}

export default CreateQRPage;