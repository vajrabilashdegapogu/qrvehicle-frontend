import { useEffect, useState, useCallback, useRef } from "react";
import api from "../services/api";
import "../css/OrdersPage.css";
// import { toPng } from "html-to-image";

function OrdersPage() {

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const tagRef = useRef();

  // ✅ LOAD ORDERS (OLD UI KEPT)
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

  // 🔄 UPDATE STATUS (UNCHANGED)
  const updateStatus = async (id, status) => {
    await api.put(`/order/${id}/status?status=${status}`);
    loadOrders();
  };

  //PDF download
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

  // ✅ NEW TAG DOWNLOAD (YOUR WORKING LOGIC)
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

  //     const dataUrl = await toPng(tagRef.current);

  //     const safeName = name.replace(/[^a-zA-Z0-9]/g, "_");
  //     const safePhone = phone.replace(/\D/g, "");

  //     const link = document.createElement("a");
  //     link.download = `${safeName}_${safePhone}.png`;
  //     link.href = dataUrl;
  //     link.click();

  //   } catch {
  //     setError("❌ Tag download failed");
  //     setTimeout(() => setError(""), 2000);
  //   }
  // };

  // ✅ GENERATE QR + TAG (UPDATED)
  const generateQR = async (o) => {
    try {
      const res = await api.post(`/from-order/${o.id}`);

      await downloadPDF(
        res.data.uniqueCode,
        o.name,
        o.phone
      );

      setMessage("✅ QR Generated & Customer Added!");
      setTimeout(() => setMessage(""), 2500);

      loadOrders();

    } catch {
      setError("❌ Error generating QR");
      setTimeout(() => setError(""), 2000);
    }
  };

  // 🗑️ DELETE ORDER (UNCHANGED)
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

  // ✏️ UPDATE ORDER (UNCHANGED)
  const updateOrder = async () => {
    await api.put(`/order/${editingOrder.id}`, editingOrder);

    setMessage("✅ Order updated");
    setTimeout(() => setMessage(""), 2000);

    setEditingOrder(null);
    loadOrders();
  };

  return (
    <>
      {/* TOASTS */}
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

                  <button
                    style={{ backgroundColor: "green" }}
                    onClick={() => updateStatus(o.id, "DELIVERED")}
                  >
                    Deliver
                  </button>
                </td>

                <td>
                  <button
                    style={{ backgroundColor: "green" }}
                    onClick={() => generateQR(o)}
                  >
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

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            ⬅ Prev
          </button>

          <span>
            Page {page + 1} / {totalPages === 0 ? 1 : totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next ➡
          </button>
        </div>

        {/* EDIT MODAL */}
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

        {/* DELETE MODAL */}
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

      {/* 🔥 TAG TEMPLATE */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div ref={tagRef} className="relative w-[600px]">

          <img src="/tag.png" alt="tag" className="w-full" />

          <img
            id="qr-img"
            src=""
            alt="qr"
            className="absolute right-[35px] top-1/2 transform -translate-y-1/2 w-[160px] h-[160px]"
          />

        </div>
      </div>
    </>
  );
}

export default OrdersPage;