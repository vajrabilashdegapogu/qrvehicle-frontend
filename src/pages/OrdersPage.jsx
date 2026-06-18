import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import "../css/OrdersPage.css";

function OrdersPage() {

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // ✅ LOAD ORDERS (FIXED WITH useCallback)
  const loadOrders = useCallback(() => {
    api.get(`/order/paginated?page=${page}&size=4`)
      .then(res => {
        setOrders(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {
        setError("❌ Failed to load orders");
        setTimeout(() => setError(""), 2000);
      });
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // 🔄 UPDATE STATUS
  const updateStatus = async (id, status) => {
    await api.put(`/order/${id}/status?status=${status}`);
    loadOrders();
  };

  // ⚡ GENERATE QR
  const generateQR = async (orderId) => {
    try {
      const res = await api.post(`/from-order/${orderId}`);

      window.open(`${api.defaults.baseURL}/qr/${res.data.uniqueCode}`);

      setMessage("✅ QR Generated & Customer Added!");
      setTimeout(() => setMessage(""), 2500);

    } catch {
      setError("❌ Error generating QR");
      setTimeout(() => setError(""), 2500);
    }
  };

  // 🗑️ DELETE ORDER
  const deleteOrder = async () => {
    try {
      await api.delete(`/order/${deleteId}`);

      setMessage("🗑️ Order deleted");
      setTimeout(() => setMessage(""), 2000);

      setDeleteId(null);
      loadOrders();

    } catch {
      setError("❌ Delete failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  // ✏️ UPDATE ORDER
  const updateOrder = async () => {
    await api.put(`/order/${editingOrder.id}`, editingOrder);

    setMessage("✅ Order updated");
    setTimeout(() => setMessage(""), 2000);

    setEditingOrder(null);
    loadOrders();
  };

  return (
    <>
      {/* 🔔 TOAST MESSAGES */}
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      <div>
        <h2>📦 Orders</h2>

        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
              <th>Generate QR</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>{o.vehicleNumber}</td>
                <td>{o.address}</td>

                <td>
                  <span className={`status ${o.status}`}>
                    {o.status}
                  </span>
                </td>

                <td>
                  <button onClick={() => updateStatus(o.id, "PROCESSING")}>
                    Process
                  </button>

                  <button style={{ backgroundColor: "green" }}
                    onClick={() => updateStatus(o.id, "DELIVERED")}>
                    Deliver
                  </button>
                </td>

                <td>
                  <button style={{ backgroundColor: "green" }}
                    onClick={() => generateQR(o.id)}>
                    ⚡ Generate QR
                  </button>
                </td>

                <td>
                  <button onClick={() => setEditingOrder(o)}>✏️ Edit</button>
                  <button onClick={() => setDeleteId(o.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔄 PAGINATION */}
        <div className="pagination">

          <button
            disabled={page === 0}
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          >
            ⬅ Prev
          </button>

          <span>
            Page {page + 1} / {totalPages === 0 ? 1 : totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next ➡
          </button>

        </div>

        {/* ✏️ EDIT MODAL */}
        {editingOrder && (
          <div className="modal-overlay">
            <div className="modal">

              <h3>Edit Order</h3>

              <input
                value={editingOrder.name}
                onChange={e =>
                  setEditingOrder({ ...editingOrder, name: e.target.value })
                }
              />

              <input
                value={editingOrder.phone}
                onChange={e =>
                  setEditingOrder({ ...editingOrder, phone: e.target.value })
                }
              />

              <input
                value={editingOrder.vehicleNumber}
                onChange={e =>
                  setEditingOrder({ ...editingOrder, vehicleNumber: e.target.value })
                }
              />

              <input
                value={editingOrder.address}
                onChange={e =>
                  setEditingOrder({ ...editingOrder, address: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button onClick={updateOrder}>Save</button>
                <button onClick={() => setEditingOrder(null)}>Cancel</button>
              </div>

            </div>
          </div>
        )}

        {/* 🗑️ DELETE MODAL */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">

              <h3>Delete this order?</h3>

              <div className="modal-buttons">
                <button onClick={deleteOrder}>Yes, Delete</button>
                <button onClick={() => setDeleteId(null)}>Cancel</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default OrdersPage;