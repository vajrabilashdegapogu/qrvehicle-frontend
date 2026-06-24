import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import "../css/AdminPage.css";
// import { toPng } from "html-to-image";
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

  const tagRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("admin") === "true");
  }, []);

  // ✅ PDF DOWNLOAD
  const downloadPDF = async (code, name, phone) => {
  try {
    const safeName = (name || "customer").replace(/[^a-zA-Z0-9]/g, "_");
    const first5 = (phone || "00000").replace(/\D/g, "").substring(0, 5);

    const res = await api.get(`/tag-pdf/${code}`, {
      responseType: "blob"   // 🔥 IMPORTANT
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}_${first5}.pdf`; // ✅ FINAL NAME
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch {
    console.error("PDF download failed");
  }
};

  // ✅ PNG TAG DOWNLOAD (optional)
  // const downloadTag = async (code, name, phone) => {
  //   try {
  //     const qrUrl = `${api.defaults.baseURL}/qr/${code}?t=${Date.now()}`;
  //     const qrImg = tagRef.current.querySelector("#qr-img");

  //     qrImg.src = "";
  //     qrImg.src = qrUrl;

  //     await new Promise((resolve, reject) => {
  //       qrImg.onload = resolve;
  //       qrImg.onerror = reject;
  //     });

  //     const dataUrl = await toPng(tagRef.current, { pixelRatio: 3 });

  //     const safeName = (name || "customer").replace(/[^a-zA-Z0-9]/g, "_");
  //     const safePhone = (phone || "0000").replace(/\D/g, "");

  //     const link = document.createElement("a");
  //     link.download = `${safeName}_${safePhone}.png`;
  //     link.href = dataUrl;
  //     link.click();

  //   } catch {
  //     setError("❌ Tag generation failed");
  //     setTimeout(() => setError(""), 2000);
  //   }
  // };

  // ✅ SUBMIT
  const submit = async () => {

    if (!form.ownerName || !form.phoneNumber || !form.vehicleNumber || !form.address) {
      setError("Please fill all fields");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      const res = await api.post("/add", form);

      // 🔥 USE PDF (BEST QUALITY)
      downloadPDF(
        res.data.uniqueCode,
        form.ownerName,
        form.phoneNumber
      );

      setMessage("✅ QR Tag Generated!");

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
      {/* SUCCESS */}
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {/* ERROR */}
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
              Generate & Download Tag
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

      {/* 🔥 HIDDEN TAG TEMPLATE (FOR PNG ONLY) */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div
          ref={tagRef}
          style={{
            width: "748px",
            height: "1661px",
            position: "relative"
          }}
        >

          <img
            src="/tag.png"
            alt="tag"
            style={{ width: "100%", height: "100%" }}
          />

          {/* ✅ PIXEL PERFECT QR */}
          <div
            style={{
              position: "absolute",
              top: "420px",
              left: "430px",
              width: "260px",
              height: "260px",
              backgroundColor: "#fff",
              borderRadius: "30px",
              border: "6px solid #ff7a00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}
          >
            <img
              id="qr-img"
              src=""
              alt="qr"
              style={{
                width: "200px",
                height: "200px"
              }}
            />
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminPage; 