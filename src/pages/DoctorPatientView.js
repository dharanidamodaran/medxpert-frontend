import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import { MdDashboard, MdPeople, MdMedicalServices, MdEvent, MdSettings, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import axios from 'axios';

// Sidebar Component
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ ...styles.sidebar.container, width: collapsed ? '80px' : '250px' }}>
      <div style={styles.sidebar.collapseButton} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MdChevronRight size={24} /> : <MdChevronLeft size={24} />}
      </div>
      
      <h2 style={styles.sidebar.title}>
        {!collapsed && 'MedXpert'}
      </h2>
      
      <ul style={styles.sidebar.navList}>
        <li style={styles.sidebar.navItem}>
          <MdDashboard size={20} style={styles.sidebar.icon} />
          {!collapsed && 'Dashboard'}
        </li>
        <li style={styles.sidebar.navItem}>
          <MdPeople size={20} style={styles.sidebar.icon} />
          {!collapsed && 'Patients'}
        </li>
        <li style={styles.sidebar.navItem}>
          <MdMedicalServices size={20} style={styles.sidebar.icon} />
          {!collapsed && 'Doctors'}
        </li>
        <li style={styles.sidebar.navItem}>
          <MdEvent size={20} style={styles.sidebar.icon} />
          {!collapsed && 'Appointments'}
        </li>
        <li style={styles.sidebar.navItem}>
          <MdSettings size={20} style={styles.sidebar.icon} />
          {!collapsed && 'Settings'}
        </li>
      </ul>
    </div>
  );
};

// Doctor Patient View Component
const DoctorPatientView = () => {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch doctorId from sessionStorage
  const doctorId = sessionStorage.getItem('doctorId');

  useEffect(() => {
    const fetchPatients = async () => {
      if (!doctorId) {
        console.error("Doctor ID not found in session storage.");
        return;
      }

      // Construct the query string for filtering by patient name if search is present
      const query = search ? `&patientName=${search}` : '';
      
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/doctor/${doctorId}/ehrs?${query}`);
        setPatients(response.data); // Assuming the data directly contains the patient records
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId, search]); // Re-fetch when doctorId or search changes

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleViewPatient = (patientRecord) => {
    setSelectedPatient(patientRecord);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <div style={styles.content}>
          <h1 style={styles.title}>Patient Records</h1>

          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>
              <FaSearch />
            </button>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div style={styles.loading}>
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Age</th>
                    <th style={styles.th}>Gender</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Last Visit</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patientRecord) => {
                    const patient = patientRecord.patient;
                    return (
                      <tr key={patient.id}>
                        <td style={styles.td}>{patient.id}</td>
                        <td style={styles.td}>{patient.name}</td>
                        <td style={styles.td}>{calculateAge(patient.dateofBirth)}</td>
                        <td style={styles.td}>{patient.gender}</td>
                        <td style={styles.td}>{patient.phone}</td>
                        <td style={styles.td}>{new Date(patientRecord.appointment.date).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          <button style={styles.actionButton} onClick={() => handleViewPatient(patientRecord)}>
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Patient Details */}
      {showModal && selectedPatient && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Patient Details</h2>
            <div style={styles.modalContent}>
              <p><strong>Name:</strong> {selectedPatient.patient.name}</p>
              <p><strong>Age:</strong> {calculateAge(selectedPatient.patient.dateofBirth)}</p>
              <p><strong>Gender:</strong> {selectedPatient.patient.gender}</p>
              <p><strong>Contact:</strong> {selectedPatient.patient.phone}</p>
              <p><strong>Address:</strong> {selectedPatient.patient.address}</p>
              <p><strong>Medical History:</strong> {selectedPatient.medicalHistory}</p>
              <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
              <p><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</p>
              <p><strong>Treatment:</strong> {selectedPatient.treatment}</p>
              <p><strong>Medications:</strong> {selectedPatient.medications.map(med => `${med.medicineName} (${med.dosage}mg, ${med.times} times, ${med.duration} days)`).join(', ')}</p>
              <p><strong>Additional Notes:</strong> {selectedPatient.additionalNotes}</p>
              <p><strong>Last Visit:</strong> {new Date(selectedPatient.appointment.date).toLocaleDateString()}</p>
            </div>
            <button onClick={closeModal} style={styles.closeModalButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  sidebar: {
    container: {
      width: '250px',
      backgroundColor: '#00796b',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'fixed',
    },
    collapseButton: {
      cursor: 'pointer',
      fontSize: '24px',
      marginBottom: '10px',
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    navList: {
      listStyle: 'none',
      paddingLeft: 0,
    },
    navItem: {
      padding: '10px 0',
      fontSize: '18px',
      cursor: 'pointer',
    },
    icon: {
      marginRight: '10px',
    },
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fff',
    marginLeft: '250px', // Adjust this value if necessary
  },
  content: {
    marginLeft: '40px', // Remove any extra gap between sidebar and content
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00796b',
  },
  searchContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginRight: '10px',
    width: '100%',
  },
  searchButton: {
    backgroundColor: '#00796b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '20px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#00796b',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  actionButton: {
    backgroundColor: '#00796b',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
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
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    marginBottom: '20px',
  },
  closeModalButton: {
    backgroundColor: '#00796b',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DoctorPatientView;
