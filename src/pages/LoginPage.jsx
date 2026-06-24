import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import Navbar from "../components/NavBar";

function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const login = () => {

    if (username === "admin" && password === "AbhiAdmin@0399") {

      localStorage.setItem("admin", "true");

      setMessage("✅ Login Successful!");

      setTimeout(() => {
        navigate("/admin");
      }, 1000);

    } else {
      setError("❌ Invalid credentials");

      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <>
      {/* ✅ SUCCESS MESSAGE */}
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {/* ❌ ERROR MESSAGE */}
      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      <div>
        <Navbar />

        <div className="login-bg">
          <div className="login-card">

            <h2>🔐 Admin Login</h2>

            <input
              className="text-black"
              placeholder="Username"
              onChange={e => setUsername(e.target.value)}
            />

            <input
              className="text-black"
              type="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />

            <button onClick={login}>Login</button>

          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;