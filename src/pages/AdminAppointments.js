import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminAppointments.css';
import { MdDashboard, MdEventNote, MdLocalHospital, MdPeople, MdAssessment,MdLogout } from 'react-icons/md';


const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointment/all-appointments');
        setAppointments(response.data);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch appointments', 'error');
      }
    };
    fetchAppointments();
  }, []);

  // Confirm an appointment
  const handleConfirm = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointment/confirm/${id}`);
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'confirmed' } : appt
      ));
      Swal.fire('Success', 'Appointment confirmed successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to confirm appointment', 'error');
    }
  };

  // Cancel an appointment with reason
  const handleCancel = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'Cancel Appointment',
      input: 'text',
      inputLabel: 'Reason for cancellation',
      inputPlaceholder: 'Enter reason...',
      showCancelButton: true,
      confirmButtonText: 'Cancel Appointment',
      cancelButtonText: 'Close',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a reason!';
        }
      }
    });

    if (reason) {
      try {
        await axios.put(`http://localhost:5000/api/appointment/cancel/${id}`, { reason });
        setAppointments(appointments.map(appt =>
          appt.id === id ? { ...appt, status: 'canceled', cancelReason: reason } : appt
        ));
        Swal.fire('Success', 'Appointment canceled successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to cancel appointment', 'error');
      }
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment =>
    (appointment.patientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (appointment.doctor?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (appointment.status?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <nav className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/admin"><MdDashboard /> Dashboard</a></li>
          <li><a href="/admin/admin-doctor-list"><MdLocalHospital /> Doctors</a></li>
          <li><a href="/admin/admin-patient-list"><MdPeople /> Patients</a></li>
        </ul>

      </nav>

      {/* Main Content */}
      <div className="admin-content">
        <h1>Admin - Appointments</h1>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Patient, Doctor, or Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="appointments-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>
                      <span className={`status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === 'pending' && (
                        <>
                          <button className="confirm-btn" onClick={() => handleConfirm(appointment.id)}>Confirm</button>
                          <button className="cancel-btn" onClick={() => handleCancel(appointment.id)}>Cancel</button>
                        </>
                      )}
                      {appointment.status === 'canceled' && (
                        <span className="status-readonly">Canceled ({appointment.cancelReason})</span>
                      )}
                      {appointment.status === 'confirmed' && (
                        <span className="status-readonly">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No matching appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
