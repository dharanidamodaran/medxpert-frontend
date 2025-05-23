import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaClock, FaHospital, FaBars } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const ViewPatientAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('upcoming');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const patientId = sessionStorage.getItem("patientId");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const apiUrl = filter === 'upcoming' 
                    ? `http://localhost:5000/api/patients/get-appointment/${patientId}`
                    : `http://localhost:5000/api/patients/${patientId}/completed-appointments`;
                
                const response = await axios.get(apiUrl);
                console.log("API Response:", response.data);
    
                if (response.data.success) {
                    setAppointments(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };
    
        fetchAppointments();
    }, [patientId, filter]);

    const handleAppointmentClick = (appointmentId) => {
        window.location.href = `/appointment/${appointmentId}`;
    };

    const handleChatClick = (appointmentId) => {
        window.location.href = `/video-audio-chat`;
    };

    const handleRescheduleClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsRescheduleModalOpen(true);
    };

    const handleCancelClick = async (appointmentId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#00796b',
                cancelButtonColor: '#d32f2f',
                confirmButtonText: 'Yes, cancel it!'
            });
    
            if (result.isConfirmed) {
                const response = await axios.put(
                    `http://localhost:5000/api/appointment/cancel/${appointmentId}`
                );
                
                // Check for the message instead of success flag
                if (response.data.message === "Appointment canceled successfully!") {
                    await Swal.fire(
                        'Cancelled!',
                        'Your appointment has been cancelled.',
                        'success'
                    );
                    setAppointments(appointments.filter(app => app.id !== appointmentId));
                } else {
                    await Swal.fire(
                        'Error',
                        response.data.message || 'Failed to cancel appointment',
                        'error'
                    );
                }
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            await Swal.fire(
                'Error',
                error.response?.data?.message || 'An error occurred while cancelling the appointment',
                'error'
            );
        }
    };


    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
    };

    const handleRescheduleModalClose = () => {
        setIsRescheduleModalOpen(false);
        setNewDate('');
        setNewTime('');
    };

    const handleRescheduleSubmit = async () => {
        if (!newDate || !newTime) {
            alert('Please select both new date and time');
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:5000/api/appointment/reschedule-appointment/${selectedAppointment.id}`,
                { newDate, newTime }
            );
    
            if (response.data.success) {
                alert('Appointment rescheduled successfully!');
                setIsRescheduleModalOpen(false);
                setAppointments(prevAppointments =>
                    prevAppointments.map(appointment =>
                        appointment.id === selectedAppointment.id
                            ? { ...appointment, date: response.data.newDate }
                            : appointment
                    )
                );
            } else {
                alert('Failed to reschedule the appointment.');
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            alert('An error occurred while rescheduling the appointment.');
        }
    };

    const handleViewAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsViewModalOpen(true);
    };

    return (
        <div style={styles.container}>
            {/* Background Image */}
            <div style={styles.backgroundImage}></div>
            
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.logo}>MedXpert</div>
                <ul style={styles.menu}>
                    <li style={styles.menuItem}>
                        <Link to="/patient" style={styles.link}><FaBars /> Dashboard</Link>
                    </li>
                    <li style={styles.menuItem}>
                        <div 
                            style={styles.link} 
                            onClick={() => setFilter('upcoming')}
                        >
                            <FaCalendarAlt /> Upcoming Appointments
                        </div>
                    </li>
                    <li style={styles.menuItem}>
                        <div 
                            style={styles.link} 
                            onClick={() => setFilter('completed')}
                        >
                            <FaCalendarAlt /> Completed Appointments
                        </div>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                <h2 style={styles.header}>Your Appointments</h2>
                <div style={styles.grid}>
                    {appointments.length === 0 ? (
                        <p style={styles.noAppointments}>No appointments found for the selected filter.</p>
                    ) : (
                        appointments.map((appointment) => (
                            <div key={appointment.id} style={styles.card}>
                                <h3 style={styles.doctor}><FaUserMd /> {appointment.name}</h3>
                                <p><FaCalendarAlt /> <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                                <p><FaClock /> <strong>Time:</strong> {new Date(appointment.date).toLocaleTimeString()}</p>
                                <p><FaHospital /> <strong>Consultation:</strong> {appointment.consultationType}</p>
                                <p style={appointment.status === "confirmed" ? styles.confirmed : styles.pending}>
                                    Status: {appointment.status}
                                </p>
                                <div style={styles.buttonContainer}>
                                    <button 
                                        style={styles.button} 
                                        onClick={() => handleChatClick(appointment.id)}
                                    >
                                        Contact Doctor
                                    </button>
                                    <button 
                                        style={styles.button} 
                                        onClick={() => handleViewAppointmentClick(appointment)}
                                    >
                                        View Appointment
                                    </button>

                                    {filter === 'upcoming' && (
                                        <>
                                            <button 
                                                style={styles.button} 
                                                onClick={() => handleRescheduleClick(appointment)}
                                            >
                                                Reschedule
                                            </button>
                                            <button 
                                                style={styles.cancelButton} 
                                                onClick={() => handleCancelClick(appointment.id)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* View Appointment Details Modal */}
            {isViewModalOpen && selectedAppointment && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Appointment Details</h3>
                        <p><strong>Doctor:</strong> {selectedAppointment.name}</p>
                        <p><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {new Date(selectedAppointment.date).toLocaleTimeString()}</p>
                        <p><strong>Consultation Type:</strong> {selectedAppointment.consultationType}</p>
                        <p><strong>Status:</strong> {selectedAppointment.status}</p>
                        <div style={styles.modalButtons}>
                            <button style={styles.button} onClick={handleViewModalClose}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Appointment Modal */}
            {isRescheduleModalOpen && selectedAppointment && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Reschedule Appointment</h3>
                        <p>Current Date: {new Date(selectedAppointment.date).toLocaleDateString()}</p>
                        <p>Current Time: {new Date(selectedAppointment.date).toLocaleTimeString()}</p>
                        <div style={styles.inputGroup}>
                            <label>New Date:</label>
                            <input 
                                type="date" 
                                value={newDate} 
                                onChange={(e) => setNewDate(e.target.value)} 
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label>New Time:</label>
                            <input 
                                type="time" 
                                value={newTime} 
                                onChange={(e) => setNewTime(e.target.value)} 
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.modalButtons}>
                            <button style={styles.button} onClick={handleRescheduleSubmit}>Submit</button>
                            <button style={styles.button} onClick={handleRescheduleModalClose}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Internal CSS Styles
const styles = {
    container: { 
        display: 'flex', 
        minHeight: '100vh', 
        fontFamily: 'Times New Roman',
        position: 'relative'
    },
    backgroundImage: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("https://images.pexels.com/photos/7108319/pexels-photo-7108319.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        zIndex: -1,
        opacity: 0.7
    },
    sidebar: { 
        width: '250px', 
        backgroundColor: 'rgba(0, 121, 107, 0.9)', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        zIndex: 1
    },
    logo: { 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '40px', 
        marginTop: '20px' 
    },
    menu: { 
        listStyle: 'none', 
        padding: '0', 
        width: '100%' 
    },
    menuItem: { 
        padding: '15px', 
        fontSize: '18px', 
        cursor: 'pointer', 
        borderRadius: '5px', 
        transition: 'background 0.3s',
        '&:hover': {
            backgroundColor: 'rgba(0, 105, 92, 0.9)'
        }
    },
    link: { 
        textDecoration: 'none', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        width: '100%' 
    },
    content: { 
        flex: '1', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px', 
        backgroundColor: 'rgba(245, 245, 245, 0.85)',
        zIndex: 1
    },
    header: { 
        fontSize: '32px', 
        color: '#00796b', 
        marginBottom: '30px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '1200px' 
    },
    card: { 
        backgroundColor: 'rgba(255, 255, 255, 0.63)', 
        padding: '25px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
        }
    },
    noAppointments: {
        color: '#555',
        fontSize: '18px',
        gridColumn: '1 / -1',
        textAlign: 'center'
    },
    doctor: {
        color: '#00796b',
        marginBottom: '15px'
    },
    confirmed: { 
        color: 'green', 
        fontWeight: 'bold' 
    },
    pending: { 
        color: 'orange', 
        fontWeight: 'bold' 
    },
    buttonContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        marginTop: '15px' 
    },
    button: { 
        backgroundColor: '#00796b', 
        color: 'white', 
        border: 'none', 
        padding: '10px', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        transition: 'background 0.3s',
        '&:hover': {
            backgroundColor: '#00695c'
        }
    },
    cancelButton: {
        backgroundColor: '#d32f2f',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        '&:hover': {
            backgroundColor: '#b71c1c'
        }
    },
    modal: { 
        position: 'fixed', 
        top: '0', 
        left: '0', 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: { 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        width: '400px', 
        maxWidth: '90%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    },
    modalButtons: { 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center',
        marginTop: '20px'
    },
    inputGroup: {
        margin: '15px 0',
        textAlign: 'left'
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    }
};

export default ViewPatientAppointment;