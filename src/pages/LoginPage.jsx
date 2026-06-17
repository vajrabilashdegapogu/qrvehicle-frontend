import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import Navbar from "../components/NavBar";


function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = () => {

    // 🔥 Simple static login (you can upgrade later)
    if (username === "admin" && password === "1234") {

      localStorage.setItem("admin", "true"); // ✅ store login
      navigate("/admin");

    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <Navbar />
    <div className="login-bg">
      <div className="login-card">

        <h2>🔐 Admin Login</h2>

        <input className="text-black"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input className="text-black"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

      </div>
    </div>
    </div>
  );
}

export default LoginPage;