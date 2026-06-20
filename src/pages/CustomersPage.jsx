import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import "../css/CustomersPage.css";

function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // ✅ LOAD CUSTOMERS
  const loadCustomers = useCallback(() => {
    api.get(`/vehicle/paginated?page=${page}&size=9`)
      .then(res => {
        setCustomers(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {
        setError("❌ Failed to load customers");
        setTimeout(() => setError(""), 2000);
      });
  }, [page]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // ✅ FINAL QR DOWNLOAD (ONLY QR)
  const downloadQR = (c) => {
    const safeName = c.ownerName.replace(/[^a-zA-Z0-9]/g, "_");
    const safePhone = c.phoneNumber.replace(/\D/g, "");

    const link = document.createElement("a");
    link.href = `${api.defaults.baseURL}/qr/${c.uniqueCode}`;
    link.download = `${safeName}_${safePhone}.png`;
    link.click();
  };

  // 🗑️ DELETE CUSTOMER
  const deleteCustomer = async () => {
    try {
      await api.delete(`/vehicle/${deleteId}`);
      setMessage("🗑️ Customer deleted");
      setTimeout(() => setMessage(""), 2000);
      setDeleteId(null);
      loadCustomers();
    } catch {
      setError("❌ Delete failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  // ✏️ UPDATE CUSTOMER
  const updateCustomer = async () => {
    await api.put(`/vehicle/${editingCustomer.id}`, editingCustomer);
    setMessage("✅ Customer updated");
    setTimeout(() => setMessage(""), 2000);
    setEditingCustomer(null);
    loadCustomers();
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
        <h2>👥 Customers</h2>

        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Address</th>
              <th>QR</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.ownerName}</td>
                <td>{c.phoneNumber}</td>
                <td>{c.vehicleNumber}</td>
                <td>{c.address}</td>

                <td>
                  <button
                    style={{ backgroundColor: "green", color: "black" }}
                    onClick={() => downloadQR(c)}
                  >
                    ⬇️ Download QR
                  </button>
                </td>

                <td>
                  <button onClick={() => setEditingCustomer(c)}>✏️ Edit</button>
                  <button onClick={() => setDeleteId(c.id)}>🗑️ Delete</button>
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

          <span>Page {page + 1} / {totalPages || 1}</span>

          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            Next ➡
          </button>
        </div>

        {/* EDIT MODAL */}
        {editingCustomer && (
          <div className="modal-overlay">
            <div className="modal">

              <h3>Edit Customer</h3>

              <input
                value={editingCustomer.ownerName}
                onChange={e =>
                  setEditingCustomer({ ...editingCustomer, ownerName: e.target.value })
                }
              />

              <input
                value={editingCustomer.phoneNumber}
                onChange={e =>
                  setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value })
                }
              />

              <input
                value={editingCustomer.vehicleNumber}
                onChange={e =>
                  setEditingCustomer({ ...editingCustomer, vehicleNumber: e.target.value })
                }
              />

              <input
                value={editingCustomer.address || ""}
                onChange={e =>
                  setEditingCustomer({ ...editingCustomer, address: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button onClick={updateCustomer}>Save</button>
                <button onClick={() => setEditingCustomer(null)}>Cancel</button>
              </div>

            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete this customer?</h3>
              <div className="modal-buttons">
                <button onClick={deleteCustomer}>Yes, Delete</button>
                <button onClick={() => setDeleteId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default CustomersPage;