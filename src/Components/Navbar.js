import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-black text-white">

      {/* LEFT - LOGO */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" className="w-8" />
      </div>

      {/* CENTER - BRAND */}
      <h1 className="text-xl font-bold tracking-wide">
        OwnTag
      </h1>

      {/* RIGHT - MENU */}
      <div className="flex gap-6 items-center">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/track")}>Track</button>
        <button onClick={() => navigate("/generate")}>Order QR</button>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-500 px-4 py-2 rounded"
        >
          Login
        </button>
      </div>

    </div>
  );
}