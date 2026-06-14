import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import VehiclePage from "./pages/VehiclePage";
import OrdersPage from "./pages/OrdersPage";
// import CreateQRPage from "./pages/CreateQRPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./Auth/PrivateRoute";
import LoginPage from "./pages/LoginPage";
// import DashboardHome from "./pages/DashBoardHome";


function App(){
  return(
    <BrowserRouter>
      <Routes>

        {/* 🔐 Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🚗 Public QR page */}
        <Route path="/v/:code" element={<VehiclePage />} />

        {/* 🧾 Orders (optional) */}
        <Route path="/orders" element={<OrdersPage />} />

        {/* ➕ Create QR (Admin form page) */}
        <Route path="/" element={<AdminPage />} />
        

        {/* 🔐 Protected Dashboard */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;