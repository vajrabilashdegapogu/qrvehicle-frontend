import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/NavBar";

export default function TrackPage() {

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  const search = async () => {
    try {
      const res = await api.get(`/order/track/${phone.trim()}`);
      setOrders(res.data);
    } catch {
      alert("No orders found");
    } 
  };

  const getStep = (status) => {
    if (status === "PENDING") return 1;
    if (status === "PROCESSING") return 2;
    if (status === "DELIVERED") return 3;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 text-white">

      <Navbar />

      {/* HEADER */}
      <div className="text-center mt-16 sm:mt-20 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
          Track Your Order
        </h1>
        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Enter your phone number
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="flex justify-center mt-8 sm:mt-10 px-4">
        <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl w-full max-w-md shadow-xl">

          <input
            className="w-full p-3 rounded bg-white text-black mb-4 outline-none text-sm sm:text-base"
            placeholder="📱 Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={search}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-lg font-semibold text-sm sm:text-base hover:scale-105 transition"
          >
            🔍 Track Order
          </button>

        </div>
      </div>

      {/* RESULTS */}
      <div className="mt-10 sm:mt-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">

        {orders.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No orders to display
          </p>
        )}

        {orders.map((o, i) => {
          const step = getStep(o.status);

          return (
            <div key={i} className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg">

              {/* DETAILS */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold">{o.name}</h2>
                <p className="text-gray-300 text-sm sm:text-base">{o.vehicleNumber}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{o.phone}</p>
              </div>

              {/* STATUS */}
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                o.status === "PENDING"
                  ? "bg-red-500"
                  : o.status === "PROCESSING"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}>
                {o.status}
              </span>

              {/* RESPONSIVE TIMELINE */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center">

                {/* STEP 1 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                    step >= 1 ? "bg-green-500" : "bg-gray-500"
                  }`}>
                    ✔
                  </div>
                  <p className="text-xs mt-1">Placed</p>
                </div>

                <div className={`h-1 w-full sm:w-20 my-2 sm:my-0 ${
                  step >= 2 ? "bg-green-500" : "bg-gray-500"
                }`} />

                {/* STEP 2 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                    step >= 2 ? "bg-green-500" : "bg-gray-500"
                  }`}>
                    ⚙
                  </div>
                  <p className="text-xs mt-1">Processing</p>
                </div>

                <div className={`h-1 w-full sm:w-20 my-2 sm:my-0 ${
                  step >= 3 ? "bg-green-500" : "bg-gray-500"
                }`} />

                {/* STEP 3 */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ${
                    step >= 3 ? "bg-green-500" : "bg-gray-500"
                  }`}>
                    🚚
                  </div>
                  <p className="text-xs mt-1">Delivered</p>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}