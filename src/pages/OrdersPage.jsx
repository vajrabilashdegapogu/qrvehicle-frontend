import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/OrdersPage.css";

function OrdersPage() {

  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const updateStatus = async (id, status) => {
  await api.put(`/order/${id}/status?status=${status}`);

  // reload current page properly
  api.get(`/order/paginated?page=${page}&size=4`)
    .then(res => {
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    });
};

 useEffect(() => {
  api.get(`/order/paginated?page=${page}&size=4`)
    .then(res => {
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    })
    .catch(err => console.error(err));
}, [page]);

const generateQR = async (orderId) => {
  try {
    const res = await api.post(`/from-order/${orderId}`);

    // Download QR
    // window.open(`http://localhost:8080/api/qr/${res.data.uniqueCode}`);
     window.open(`https://qrvehicle-backend-production.up.railway.app/api/qr/${res.data.uniqueCode}`);

    alert("✅ QR Generated & Customer Added!");

  } catch (err) {
    alert("❌ Error generating QR");
  }
};

const deleteOrder = async (id) => {
  if (!window.confirm("Delete this order?")) return;

  await api.delete(`/order/${id}`);

  // reload current page
  api.get(`/order/paginated?page=${page}&size=4`)
    .then(res => {
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    });
};

// 🔄 Update Order
  const updateOrder = async () => {
  await api.put(`/order/${editingOrder.id}`, editingOrder);

  // reload page
  api.get(`/order/paginated?page=${page}&size=9`)
    .then(res => {
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    });

  setEditingOrder(null);
};


  return (
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
              <button style={{color:"black"}} onClick={() => updateStatus(o.id, "PROCESSING")}>
                Process
              </button>

              <button style={{backgroundColor:"green"}} onClick={() => updateStatus(o.id, "DELIVERED")}>
                Deliver
              </button>
            </td>

            <td>
            <button style={{backgroundColor:"green"}} onClick={() => generateQR(o.id)}>⚡ Generate QR</button>
            </td>

            <td>
            <button style={{color:"black"}} onClick={() => setEditingOrder(o)}>✏️Edit</button>
            <button onClick={() => deleteOrder(o.id)}>🗑️Delete</button>
            </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* 🔥 PAGINATION UI */}
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

      {/* 🔥 EDIT MODAL */}
      {editingOrder && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>Edit Order</h3>

            <input
              value={editingOrder.name}
              onChange={e =>
                setEditingOrder({
                  ...editingOrder,
                  name: e.target.value
                })
              }
            />

            <input
              value={editingOrder.phone}
              onChange={e =>
                setEditingOrder({
                  ...editingOrder,
                  phone: e.target.value
                })
              }
            />

            <input
              value={editingOrder.vehicleNumber}
              onChange={e =>
                setEditingOrder({
                  ...editingOrder,
                  vehicleNumber: e.target.value
                })
              }
            />

            <input
              value={editingOrder.address}
              onChange={e =>
                setEditingOrder({
                  ...editingOrder,
                  address: e.target.value
                })
              }
            />

            <div className="modal-buttons">
              <button onClick={updateOrder}>Save</button>
              <button onClick={() => setEditingOrder(null)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default OrdersPage;