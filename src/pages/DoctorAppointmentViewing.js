import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaBars } from 'react-icons/fa';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const doctorId = JSON.parse(sessionStorage.getItem('doctorId'));

  useEffect(() => {
    if (doctorId) fetchAppointments();
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/get-appointments/${doctorId}`);
      const data = Array.isArray(res.data.todayAppointments) ? res.data.todayAppointments : [];
      setAppointments(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleViewDetails = (appt) => {
    if (appt.status.toLowerCase() === 'completed') {
      setSelectedAppointment(appt);
      setModalOpen(true);
    } else {
      navigate(`/doctor/prescription-form/${appt.id}`, {
        state: { appointment: appt },
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="doctor-appointments">
      <style>{`
        .doctor-appointments {
          font-family: 'Times New Roman', serif;
          min-height: 100vh;
          display: flex;
          background-color: #f3f4f6;
        }
        .sidebar {
          width: 20%;
          background-color: #0f766e;
          color: white;
          padding: 1.5rem;
          display: none;
        }
        @media (min-width: 768px) {
          .sidebar {
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
        }
        .sidebar h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
          font-size: 1rem;
        }
        .sidebar li {
          margin-bottom: 1.25rem;
          cursor: pointer;
        }
        .sidebar li:hover {
          color: #d1d5db;
        }
        .active-link {
          font-weight: 600;
          text-decoration: underline;
          color: #ccfbf1;
        }
        .main-content {
          flex: 1;
          padding-left: 4.5rem;
          background-color: #f9fafb;
        }
        .main-content h2 {
          font-size: 1.875rem;
          font-weight: bold;
          color: #0f766e;
          margin-bottom: 1.5rem;
        }
        .appointment-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) {
          .appointment-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .appointment-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .card {
          background-color: white;
          border: 1px solid #e5e7eb;
          padding: 1.25rem;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .card p {
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .card p strong {
          font-weight: 600;
        }
        .card-status {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          font-weight: bold;
        }
        .status-pending {
          color: #b45309;
        }
        .status-completed {
          color: #047857;
        }
        .view-details {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: #0f766e;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .view-details:hover {
          color: #0d9488;
        }
        .view-details svg {
          margin-right: 0.25rem;
        }
        /* Modal Styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: ${modalOpen ? 'flex' : 'none'};
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          width: 90%;
          max-width: 600px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 {
          font-size: 1.5rem;
          color: #047857;
        }
        .modal-header button {
          background-color: transparent;
          border: none;
          font-size: 1.25rem;
          color: #047857;
        }
        .modal-body p {
          font-size: 1rem;
          margin: 0.5rem 0;
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <h3><FaBars /> Menu</h3>
        <ul>
          <li>Dashboard</li>
          <li className="active-link">Appointments</li>
          <li>Patients</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Today's Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600 text-lg">No appointments found.</p>
        ) : (
          <div className="appointment-grid">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="card"
                onClick={() => handleViewDetails(appt)}
              >
                <h3>{appt.patient?.name || 'Unknown Patient'}</h3>
                <p><strong>Date:</strong> {formatDate(appt.date)}</p>
                <p><strong>Time:</strong> {formatTime(appt.date)}</p>
                <p><strong>Reason:</strong> {appt.reasonForVisit}</p>
                <p><strong>Consultation:</strong> {appt.consultationType}</p>
                <p className={`card-status ${
                  appt.status?.toLowerCase() === 'pending'
                    ? 'status-pending'
                    : 'status-completed'
                }`}>
                  {appt.status}
                </p>
                <div className="view-details">
                  <FaEye /> View Details
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Completed Appointment */}
      {modalOpen && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <button onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Patient:</strong> {selectedAppointment.patient?.name || 'Unknown Patient'}</p>
              <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
              <p><strong>Time:</strong> {formatTime(selectedAppointment.date)}</p>
              <p><strong>Reason:</strong> {selectedAppointment.reasonForVisit}</p>
              <p><strong>Consultation Type:</strong> {selectedAppointment.consultationType}</p>
              <p><strong>Status:</strong> {selectedAppointment.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
