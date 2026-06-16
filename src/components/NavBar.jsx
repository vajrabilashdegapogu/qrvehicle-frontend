import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onOrderClick }) {
 

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">

      {/* LEFT LOGO */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" className="w-8 h-8" alt="logo" />
      </div>

      {/* CENTER BRAND */}
      <h1 className="text-xl font-bold tracking-wide">
        OwnTag
      </h1>

      {/* RIGHT MENU */}
      <div className="hidden md:flex gap-6 items-center">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/track")} >Track</button>
        <button onClick={onOrderClick}>Order Now</button>
        <button onClick={() => navigate("/login")}
          className="bg-indigo-500 px-4 py-2 rounded">
          Login
        </button>
      </div>

      {/* MOBILE */}
      <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-black flex flex-col items-center gap-4 py-6 md:hidden">
          <button onClick={() => navigate("/")}>Home</button>
          <button>Track</button>
          <button onClick={onOrderClick}>Order Now</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      )}

    </nav>
  );
}