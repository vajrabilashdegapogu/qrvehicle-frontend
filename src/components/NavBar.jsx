import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onOrderClick }) {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between relative">

      {/* LEFT LOGO */}
      <div className="flex items-center">
        <img src="/favicon.png" className="w-[56px] h-[56px] rounded-full" alt="logo" />
      </div>

      {/* CENTER BRAND (FIXED CENTER) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          OwnTag
        </h1>
        <p className="text-xs md:text-sm text-gray-400">
          YOUR VEHICLE • YOUR IDENTITY
        </p>
      </div>

      {/* RIGHT MENU (DESKTOP) */}
      <div className="hidden md:flex gap-6 items-center">
        <button onClick={() => navigate("/")}>Home</button>

        <button onClick={() => navigate("/track")}>
          Track
        </button>

        <button onClick={onOrderClick}>
          Order Now
        </button>

        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-500 px-4 py-2 rounded"
        >
          Login
        </button>
      </div>

      {/* MOBILE MENU ICON */}
      <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="absolute top-20 left-0 w-full bg-black flex flex-col items-center gap-4 py-6 md:hidden z-50">

          <button onClick={() => {navigate("/"); setOpen(false);}}>
            Home
          </button>

          <button onClick={() => {navigate("/track"); setOpen(false);}}>
            Track
          </button>

          <button onClick={() => {onOrderClick(); setOpen(false);}}>
            Order Now
          </button>

          <button onClick={() => {navigate("/login"); setOpen(false);}}>
            Login
          </button>

        </div>
      )}

    </nav>
  );
}