import { useEffect, useState } from "react";
import api from "../services/api";
import "../css/CustomersPage.css";

function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    api.get("/all").then(res => setCustomers(res.data));
  }, []);

  const downloadQR = (code) => {
  window.open("https://qrvehicle-backend-production.up.railway.app/api/qr/" + code);
};

const deleteCustomer = async (id) => {
  if (!window.confirm("Delete this customer?")) return;

  await api.delete(`/vehicle/${id}`);
//   window.location.reload();
setCustomers(prev => prev.filter(c => c.id !== id));
};

const [page, setPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  api.get(`/vehicle/paginated?page=${page}&size=9`)
    .then(res => {
      setCustomers(res.data.content);
      setTotalPages(res.data.totalPages);
    });
}, [page]);

const updateCustomer = async () => {
  await api.put(`/vehicle/${editingCustomer.id}`, editingCustomer);

  setCustomers(prev =>
    prev.map(c =>
      c.id === editingCustomer.id ? editingCustomer : c
    )
  );

  setEditingCustomer(null);
};

// const editCustomer = (c) => {
//   const name = prompt("Name:", c.ownerName);
//   const phone = prompt("Phone:", c.phoneNumber);
//   const vehicle = prompt("Vehicle:", c.vehicleNumber);

//   api.put(`/vehicle/${c.id}`, {
//     ownerName: name,
//     phoneNumber: phone,
//     vehicleNumber: vehicle
//   }).then(() => {
//     setCustomers(prev =>
//       prev.map(x =>
//         x.id === c.id
//           ? { ...x, ownerName: name, phoneNumber: phone, vehicleNumber: vehicle }
//           : x
//       )
//     );
//   });
// };

  return (
    <div>
      <h2>👥 Customers</h2>

      <table className="customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Vehicle</th>
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
              <td className="qr-cell"><button style={{backgroundColor:"green", color:"black"}} onClick={() => downloadQR(c.uniqueCode)}>⬇️ Download QR</button></td>
              <td>
                <button style={{color:"black"}} onClick={() => setEditingCustomer(c)}>✏️Edit</button>
                <button onClick={() => deleteCustomer(c.id)}>🗑️Delete</button>
            </td>
            </tr>
          ))}
        </tbody>

      </table>
      <div className="pagination">
  <button disabled={page === 0} onClick={() => setPage(page - 1)}>
    ⬅ Prev
  </button>

  <span>Page {page + 1} / {totalPages}</span>

  <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>
    Next ➡
  </button>
</div>

      {editingCustomer && (
  <div className="modal-overlay">
    <div className="modal">

      <h3>Edit Customer</h3>

      <input
        value={editingCustomer.ownerName}
        onChange={e =>
          setEditingCustomer({
            ...editingCustomer,
            ownerName: e.target.value
          })
        }
      />

      <input
        value={editingCustomer.phoneNumber}
        onChange={e =>
          setEditingCustomer({
            ...editingCustomer,
            phoneNumber: e.target.value
          })
        }
      />

      <input
        value={editingCustomer.vehicleNumber}
        onChange={e =>
          setEditingCustomer({
            ...editingCustomer,
            vehicleNumber: e.target.value
          })
        }
      />

      <div className="modal-buttons">
        <button onClick={updateCustomer}>Save</button>
        <button onClick={() => setEditingCustomer(null)}>Cancel</button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default CustomersPage;