import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaPills, FaListAlt } from 'react-icons/fa'; // pharmacy icon

const AddMedicineForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicine/add-medicine', formData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Medicine added successfully!',
        confirmButtonColor: '#008080',
      });
      setFormData({ name: '', description: '', price: '', category: '', stock: '' });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add medicine. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}><FaPills style={{ marginRight: '10px' }} />MedXpert</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/pharmacy/pharmacy-dashboard" style={styles.link}><FaPills style={styles.icon} /> Pharmacy Dashboard</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/pharmacy/delivered-orders" style={styles.link}><FaListAlt style={styles.icon} /> Orders</Link>
          </li>
        </ul>
      </div>

      {/* Main Form */}
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <h2 style={styles.title}>Add Medicine</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="name" placeholder="Medicine Name" value={formData.name} onChange={handleChange} style={styles.input} required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={styles.textarea} required />
            <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} style={styles.input} required />
            <select name="category" value={formData.category} onChange={handleChange} style={styles.input} required>
              <option value="">Select Category</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Drops">Drops</option>
              <option value="Ointment">Ointment</option>
            </select>
            <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} style={styles.input} required />
            <button type="submit" style={styles.button}>Add Medicine</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    fontFamily: 'Times New Roman, serif',
    minHeight: '100vh',
    backgroundImage: `url("https://images.pexels.com/photos/13111784/pexels-photo-13111784.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#008080cc',
    color: 'white',
    padding: '30px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  sidebarTitle: {
    fontSize: '24px',
    marginBottom: '40px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    margin: '15px 0',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '8px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.48)',
    borderRadius: '15px',
    padding: '25px 30px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    fontFamily: 'Times New Roman, serif',
    width: '100%',
    maxWidth: '500px',
    color: '#333',
  },
  title: {
    textAlign: 'center',
    color: '#004d40',
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    minHeight: '80px',
  },
  button: {
    backgroundColor: '#008080',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AddMedicineForm;
