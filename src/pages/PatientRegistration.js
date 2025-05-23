import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    gender: '',
    dateofBirth: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedName = sessionStorage.getItem('userName');
    const storedPhone = sessionStorage.getItem('phone');
    const storedDob = sessionStorage.getItem('dateofBirth');
    const storedAddress = sessionStorage.getItem('address');
    const storedGender = sessionStorage.getItem('gender');

    if (storedUserId) {
      setFormData({
        userId: storedUserId,
        name: storedName || '',
        phone: storedPhone || '',
        dateofBirth: storedDob || '',
        address: storedAddress || '',
        gender: storedGender || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/patients/save-profile', formData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
          icon: 'success',
          confirmButtonColor: '#00796b',
          confirmButtonText: 'Go to Dashboard'
        }).then(() => {
          navigate('/patient');
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: 'Failed!',
        text: 'Failed to update profile. Check console for details.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Side Navigation */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}><i className="fas fa-notes-medical" style={{ marginRight: '10px' }}></i>MedXpert</h3>
        <ul style={styles.sidebarLinks}>
          <li><Link to="/patient" style={styles.link}><i className="fas fa-home"></i> Dashboard</Link></li>
          <li><Link to="/patient/appointment-form" style={styles.link}><i className="fas fa-calendar-check"></i>Book an Appointment</Link></li>
          <li><Link to="/patient/patient-prescription" style={styles.link}><i className="fas fa-notes-medical"></i> Medical History</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Form Card */}
        <div style={styles.card}>
          <h2 style={styles.heading}>
            <i className="fas fa-user-injured" style={{ marginRight: '8px' }}></i>
            Update Profile
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.input}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Birth:</label>
              <input type="date" name="dateofBirth" value={formData.dateofBirth} onChange={handleChange} required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone:</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={styles.input} />
            </div>

            <button type="submit" style={styles.submitButton}>Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundImage: `url('https://images.pexels.com/photos/7088525/pexels-photo-7088525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  
  sidebar: {
    width: '220px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: '20px',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  
  sidebarTitle: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#1b1b1b',
    fontWeight: 'bold',
  },
  
  sidebarLinks: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  
  link: {
    textDecoration: 'none',
    color: '#222',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '600px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  
  heading: {
    color: '#00796b',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  
  submitButton: {
    backgroundColor: '#00796b',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.2s',
    width: '100%',
  },
};

export default PatientRegistration;