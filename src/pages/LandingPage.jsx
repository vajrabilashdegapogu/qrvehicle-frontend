import { useState } from "react";
import Navbar from "../components/NavBar";
import api from "../services/api";

export default function LandingPage() {
  
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicleNumber: "",
    address: ""
  });

  const submit = async () => {
    try {
      await api.post("/order", form);

      setSuccess(true);

      // ✅ Reset form
      setForm({
        name: "",
        phone: "",
        vehicleNumber: "",
        address: ""
      });

      // ✅ Close form after success
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);   // 🔥 FIX
      }, 2500);

    } catch {
      console.log("Error placing order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white">

      <Navbar onOrderClick={() => setShowForm(true)} />

      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold">OwnTag</h1>

        <p className="text-indigo-300 mt-3 text-lg">
          TAG IT • SCAN IT • MOVE IT
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="mt-6 bg-orange-500 px-6 py-3 rounded-lg"
        >
          Order Now
        </button>
      </section>

      {/* TAG PREVIEW */}
      <section className="flex justify-center py-16">

      <div className="w-[600px]">
    
      <img
      src="/tag01.png"   // 👈 your image name (change if different)
      alt="OwnTag Preview"
      className="w-full rounded-xl shadow-2xl"
      />

      </div>

    </section>

      {/* VIDEO */}
      <section className="text-center py-16 px-6">
        <h2 className="text-2xl mb-6">See It In Action</h2>
        <video controls className="w-full max-w-xl mx-auto rounded">
          <source src="/demo.mp4" type="video/mp4" />
        </video>
      </section>

      {/* ADS */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-16 text-center">
        <div className="bg-white/10 p-6 rounded">Fast Delivery</div>
        <div className="bg-white/10 p-6 rounded">Secure QR</div>
        <div className="bg-white/10 p-6 rounded">Easy Tracking</div>
      </section>

      {/* ORDER FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white text-black p-8 rounded-2xl w-[90%] max-w-md shadow-2xl relative">

            <h2 className="text-2xl font-bold mb-6 text-center">
              🚗 Order Your QR Tag
            </h2>

            <div className="space-y-3">

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="👤 Full Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="📱 Phone Number"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />

              <input
                className="w-full p-3 border rounded-lg"
                placeholder="🚘 Vehicle Number"
                value={form.vehicleNumber}
                onChange={e => setForm({...form, vehicleNumber: e.target.value})}
              />

              <textarea
                className="w-full p-3 border rounded-lg"
                placeholder="📍 Delivery Address"
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />

            </div>

            <button
              onClick={submit}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold"
            >
              🚀 Place Order
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-gray-500 text-xl"
            >
              ✖
            </button>

          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-white text-black rounded-2xl p-8 w-[90%] max-w-sm text-center shadow-2xl">

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl text-white">✔</span>
            </div>

            <h2 className="text-xl font-bold mb-2">
              Order Placed!
            </h2>

            <p className="text-gray-600 text-sm">
              Your QR tag order has been received successfully 🚀
            </p>

          </div>
        </div>
      )}

    </div>
  );
}