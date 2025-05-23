import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import './AdminDoctorList.css';
import { MdDashboard, MdEventNote, MdLocalHospital, MdPeople, MdAssessment, MdLogout } from 'react-icons/md';

const AdminDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors/get-doctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleRemove = async (doctorId) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently remove the doctor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/delete-doctor/${doctorId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete doctor');
        }

        setDoctors(doctors.filter((doc) => doc.id !== doctorId));

        Swal.fire('Deleted!', 'Doctor has been removed.', 'success');
      } catch (err) {
        Swal.fire('Error!', err.message, 'error');
      }
    }
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div style={styles.adminDoctorList}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>MedXpert</h3>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarListItem}>
            <Link to="/admin" style={styles.sidebarLink}><MdDashboard style={styles.icon} />Dashboard</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/admin-patient-list" style={styles.sidebarLink}><MdLocalHospital style={styles.icon} />Patients</Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/admin/appointments" style={styles.sidebarLink}><MdPeople style={styles.icon} />Appointments</Link>
          </li>
        </ul>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.doctorListContainer}>
          <h2 style={styles.title}>Registered Doctors</h2>
          {isLoading ? (
            <div style={styles.loading}>Loading doctors...</div>
          ) : error ? (
            <div style={styles.error}>Error: {error}</div>
          ) : doctors.length === 0 ? (
            <p>No doctors registered yet.</p>
          ) : (
            <table style={styles.doctorTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Date of Birth</th>
                  <th style={styles.tableHeader}>Specialization</th>
                  <th style={styles.tableHeader}>Phone</th>
                  <th style={styles.tableHeader}>View</th>
                  <th style={styles.tableHeader}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{doctor.name}</td>
                    <td style={styles.tableCell}>{doctor.dateofBirth}</td>
                    <td style={styles.tableCell}>{doctor.specialty ? doctor.specialty.name : 'Not Available'}</td>
                    <td style={styles.tableCell}>{doctor.phone}</td>
                    <td style={styles.tableCell}>
                      <button style={styles.viewBtn} onClick={() => handleView(doctor)}>
                        View
                      </button>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        style={{ ...styles.viewBtn, ...styles.removeBtn }}
                        onClick={() => handleRemove(doctor.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedDoctor && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Doctor Details</h3>
              <p style={styles.modalText}><strong>Name:</strong> {selectedDoctor.name}</p>
              <p style={styles.modalText}><strong>Gender:</strong> {selectedDoctor.gender}</p>
              <p style={styles.modalText}><strong>Date Of Birth:</strong> {selectedDoctor.dateofBirth}</p>
              <p style={styles.modalText}><strong>Phone:</strong> {selectedDoctor.phone}</p>
              <p style={styles.modalText}><strong>Specialization:</strong> {selectedDoctor.specialty?.name || 'N/A'}</p>
              <p style={styles.modalText}><strong>Experience:</strong> {selectedDoctor.experience || 'N/A'} years</p>
              <button style={styles.viewBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  adminDoctorList: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Times New Roman, serif',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'url("https://images.pexels.com/photos/4386495/pexels-photo-4386495.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  adminDoctorListBefore: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundImage: 'url("https://images.pexels.com/photos/4386495/pexels-photo-4386495.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(2px) brightness(0.8)',
    zIndex: 0,
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#008080',
    color: '#333',
    padding: '20px',
    borderRight: '2px solid #ccc',
    fontFamily: 'Times New Roman, serif',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '22px',
    marginBottom: '15px',
    color: '#004f7c',
    fontFamily: 'Times New Roman, serif',
    fontWeight: 'bold',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    fontFamily: 'Times New Roman, serif',
    color: 'white',
  },
  sidebarListItem: {
    padding: '10px 0',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    cursor: 'pointer',
    fontFamily: 'Times New Roman, serif',
    transition: 'all 0.3s',
  },
  sidebarLink: {
    color: '#333',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Times New Roman, serif',
    fontSize: '16px',
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  mainContent: {
    flex: 1,
    maxWidth: '1000px',
    margin: 'auto',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Times New Roman, serif',
  },
  doctorListContainer: {
    fontFamily: 'Times New Roman, serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#101010',
    marginBottom: '20px',
    textAlign: 'center',
    fontFamily: 'Times New Roman, serif',
  },
  loading: {
    fontSize: '16px',
    color: '#ff6347',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: 'Times New Roman, serif',
  },
  error: {
    fontSize: '16px',
    color: '#ff6347',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: 'Times New Roman, serif',
  },
  doctorTable: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(255, 255, 255, 0.37)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Times New Roman, serif',
  },
  tableHeader: {
    backgroundColor: '#004f7c',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Times New Roman, serif',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    borderBottom: '1px solid #ddd',
    fontFamily: 'Times New Roman, serif',
  },
  tableRow: {
    transition: 'background-color 0.3s',
    fontFamily: 'Times New Roman, serif',
  },
  viewBtn: {
    padding: '6px 12px',
    backgroundColor: 'teal',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontFamily: 'Times New Roman, serif',
  },
  removeBtn: {
    backgroundColor: '#dc3545',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '25px 30px',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
    width: '400px',
    maxWidth: '90%',
    fontFamily: 'Times New Roman, serif',
  },
  modalTitle: {
    marginBottom: '15px',
    fontSize: '20px',
    color: '#004f7c',
    fontFamily: 'Times New Roman, serif',
  },
  modalText: {
    margin: '8px 0',
    fontSize: '15px',
    color: '#333',
    fontFamily: 'Times New Roman, serif',
  },
};

export default AdminDoctorList;