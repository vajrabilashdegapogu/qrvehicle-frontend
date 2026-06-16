import { useState } from "react";
import OrdersPage from "./OrdersPage";
import "../css/Dashboard.css";
import CustomersPage from "./CustomersPage";
import AdminPage from "../pages/AdminPage"; // ✅ ADD THIS
import DashboardHome from "./DashBoardHome";

function Dashboard() {

  const [page, setPage] = useState("orders");

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🚗 QRVehicle</h2>

        <button onClick={() => setPage("orders")}>📦 Orders</button>
        <button onClick={() => setPage("create")}>➕ Add Vehicle</button>
        <button onClick={() => setPage("customers")}>👥 Customers</button>
         <button className="logout-btn" onClick={() => {localStorage.removeItem("admin");
        window.location.href = "/";}}>
       🚪 Logout
        </button>
        <DashboardHome />
      </div>

      

      {/* Content */}
      <div className="content">
        {page === "orders" && <OrdersPage />}
        {page === "create" && <AdminPage />}
        {page === "customers" && <CustomersPage />}
        
       
      </div>

    </div>
  );
}

export default Dashboard;