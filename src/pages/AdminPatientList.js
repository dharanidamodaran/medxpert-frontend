import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { MdDashboard, MdPeople, MdLocalHospital, MdEventNote, MdExitToApp } from 'react-icons/md';

const AdminPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients/get-all-patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRemove = async (patientId) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently remove the patient.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/delete-patient/${patientId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete patient');
        }

        setPatients(patients.filter((pat) => pat.id !== patientId));

        Swal.fire('Deleted!', 'Patient has been removed.', 'success');
      } catch (err) {
        Swal.fire('Error!', err.message, 'error');
      }
    }
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  return (
    <div style={styles.adminPatientList}>
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>MedXpert</h3>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarListItem}>
            <Link to="/dashboard" style={styles.sidebarLink}>
              <MdDashboard style={styles.icon} /> Dashboard
            </Link>
          </li>
          {/* <li style={styles.sidebarListItem}>
            <Link to="/doctors" style={styles.sidebarLink}>
              <MdLocalHospital style={styles.icon} /> Doctors
            </Link>
          </li> */}
          <li style={{ ...styles.sidebarListItem, ...styles.activeListItem }}>
            <Link to="/patients" style={styles.sidebarLink}>
              <MdPeople style={styles.icon} /> Patients
            </Link>
          </li>
          <li style={styles.sidebarListItem}>
            <Link to="/appointments" style={styles.sidebarLink}>
              <MdEventNote style={styles.icon} /> Appointments
            </Link>
          </li>
          {/* <li style={styles.sidebarListItem}>
            <Link to="/logout" style={styles.sidebarLink}>
              <MdExitToApp style={styles.icon} /> Logout
            </Link>
          </li> */}
        </ul>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.patientListContainer}>
          <h2 style={styles.title}>Registered Patients</h2>
          {isLoading ? (
            <div style={styles.loading}>Loading patients...</div>
          ) : error ? (
            <div style={styles.error}>Error: {error}</div>
          ) : patients.length === 0 ? (
            <p style={styles.noPatients}>No patients registered yet.</p>
          ) : (
            <table style={styles.patientTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Name</th>
                  <th style={styles.tableHeader}>Date of Birth</th>
                  <th style={styles.tableHeader}>Gender</th>
                  <th style={styles.tableHeader}>Phone</th>
                  <th style={styles.tableHeader}>View</th>
                  <th style={styles.tableHeader}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{patient.name}</td>
                    <td style={styles.tableCell}>{patient.dateofBirth}</td>
                    <td style={styles.tableCell}>{patient.gender}</td>
                    <td style={styles.tableCell}>{patient.phone}</td>
                    <td style={styles.tableCell}>
                      <button style={styles.viewBtn} onClick={() => handleView(patient)}>
                        View
                      </button>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        style={{ ...styles.viewBtn, ...styles.removeBtn }}
                        onClick={() => handleRemove(patient.id)}
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

        {showModal && selectedPatient && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Patient Details</h3>
              <p style={styles.modalText}><strong>Name:</strong> {selectedPatient.name}</p>
              <p style={styles.modalText}><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p style={styles.modalText}><strong>Date Of Birth:</strong> {selectedPatient.dateofBirth}</p>
              <p style={styles.modalText}><strong>Phone:</strong> {selectedPatient.phone}</p>
              <p style={styles.modalText}><strong>Address:</strong> {selectedPatient.address || 'N/A'}</p>
              <button style={styles.viewBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  adminPatientList: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '"Times New Roman", Times, serif',
    position: 'relative',
    overflow: 'hidden',
  },
  adminPatientListBefore: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundImage: 'url("https://images.pexels.com/photos/7108326/pexels-photo-7108326.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(1px) brightness(0.9)',
    zIndex: 0,
  },
  sidebar: {
    width: '220px',
    backgroundColor: 'rgba(0, 128, 128, 0.95)',
    color: 'white',
    padding: '20px',
    borderRight: '2px solid #ccc',
    fontFamily: '"Times New Roman", Times, serif',
  },
  sidebarTitle: {
    fontSize: '22px',
    marginBottom: '15px',
    fontFamily: '"Times New Roman", Times, serif',
    fontWeight: 'bold',
  },
  sidebarList: {
    listStyle: 'none',
    padding: 0,
    fontFamily: '"Times New Roman", Times, serif',
  },
  sidebarListItem: {
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    fontFamily: '"Times New Roman", Times, serif',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  activeListItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sidebarLink: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    fontFamily: '"Times New Roman", Times, serif',
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
    backgroundColor: 'rgba(255, 255, 255, 0.43)',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Times New Roman", Times, serif',
  },
  patientListContainer: {
    flex: 1,
    fontFamily: '"Times New Roman", Times, serif',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#101010',
    marginBottom: '20px',
    textAlign: 'center',
    fontFamily: '"Times New Roman", Times, serif',
  },
  loading: {
    fontSize: '16px',
    color: '#ff6347',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: '"Times New Roman", Times, serif',
  },
  error: {
    fontSize: '16px',
    color: '#ff6347',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: '"Times New Roman", Times, serif',
  },
  noPatients: {
    fontSize: '16px',
    color: '#555',
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: '"Times New Roman", Times, serif',
  },
  patientTable: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Times New Roman", Times, serif',
  },
  tableHeader: {
    backgroundColor: '#004f7c',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Times New Roman", Times, serif',
  },
  tableRow: {
    ':hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  tableCell: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    borderBottom: '1px solid #ddd',
    fontFamily: '"Times New Roman", Times, serif',
  },
  viewBtn: {
    padding: '6px 12px',
    backgroundColor: '#008cba',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    fontFamily: '"Times New Roman", Times, serif',
    ':hover': {
      backgroundColor: '#006f8e',
    },
  },
  removeBtn: {
    backgroundColor: '#dc3545',
    ':hover': {
      backgroundColor: '#c82333',
    },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    padding: '20px 30px',
    borderRadius: '10px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    fontFamily: '"Times New Roman", Times, serif',
  },
  modalTitle: {
    marginBottom: '15px',
    fontSize: '20px',
    color: '#004f7c',
    fontFamily: '"Times New Roman", Times, serif',
  },
  modalText: {
    margin: '8px 0',
    fontSize: '15px',
    color: '#333',
    fontFamily: '"Times New Roman", Times, serif',
  },
};

export default AdminPatientList;