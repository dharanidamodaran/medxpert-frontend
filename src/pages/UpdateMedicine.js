import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const UpdateMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicine/all-medicine');
      setMedicines(res.data);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setMedicines(prev =>
      prev.map(med =>
        med.id === id ? { ...med, [name]: value } : med
      )
    );
  };

  const handleUpdate = async (id) => {
    const medToUpdate = medicines.find(med => med.id === id);
    try {
      await axios.put('http://localhost:5000/api/medicine/update-medicine', medToUpdate);
      Swal.fire('Updated!', 'Medicine updated successfully', 'success');
      setEditRow(null);
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'Failed to update medicine', 'error');
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>MedXpert</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}><Link to="/" style={styles.link}>Add Medicine</Link></li>
          <li style={styles.navItem}><Link to="/pharmacy/update-medicine" style={styles.link}>Pharmacy</Link></li>
          <li style={styles.navItem}><Link to="/pharmacy/pharmacy-dashboard" style={styles.link}>Dashboard</Link></li>
        </ul>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.title}>Medicine Inventory</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Description</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med.id}>
                <td>
                  {editRow === med.id ? (
                    <input name="name" value={med.name} onChange={(e) => handleInputChange(e, med.id)} />
                  ) : (
                    med.name
                  )}
                </td>
                <td>
                  {editRow === med.id ? (
                    <input name="description" value={med.description} onChange={(e) => handleInputChange(e, med.id)} />
                  ) : (
                    med.description
                  )}
                </td>
                <td>
                  {editRow === med.id ? (
                    <input type="number" name="price" value={med.price} onChange={(e) => handleInputChange(e, med.id)} />
                  ) : (
                    `₹${med.price}`
                  )}
                </td>
                <td>
                  {editRow === med.id ? (
                    <input type="number" name="stock" value={med.stock} onChange={(e) => handleInputChange(e, med.id)} />
                  ) : (
                    med.stock
                  )}
                </td>
                <td>
                  {editRow === med.id ? (
                    <button onClick={() => handleUpdate(med.id)} style={styles.button}>Save</button>
                  ) : (
                    <button onClick={() => setEditRow(med.id)} style={styles.button}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    fontFamily: 'Times New Roman, serif',
    backgroundColor: '#f9fdfd',
    minHeight: '100vh',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#008080',
    padding: '20px',
    color: '#fff',
    height: '100vh',
    boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '24px',
    marginBottom: '30px',
    borderBottom: '2px solid #ffffff40',
    paddingBottom: '10px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    marginBottom: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
  content: {
    flex: 1,
    padding: '40px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    color: '#004d40',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
  button: {
    padding: '6px 10px',
    backgroundColor: '#008080',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default UpdateMedicine;
