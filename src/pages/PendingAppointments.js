import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaClock, FaUser, FaCheck, FaTimes, FaHome } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/admin/get-pending-appointments");
            setAppointments(response.data.data);
        } catch (error) {
            console.error("Error fetching pending appointments:", error);
            toast.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/confirm-appointment/${id}`);
            toast.success("Appointment confirmed successfully");
            fetchAppointments();
        } catch (error) {
            console.error("Error confirming appointment:", error);
            toast.error("Failed to confirm appointment");
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/cancel-appointment/${id}`);
            toast.success("Appointment cancelled successfully");
            fetchAppointments();
        } catch (error) {
            console.error("Error canceling appointment:", error);
            toast.error("Failed to cancel appointment");
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>MedXpert</h2>
                <ul style={styles.menu}>
                    <li style={styles.menuItem}>
                        <Link to="/admin" style={styles.link}>
                            <FaHome style={{ marginRight: "10px" }} /> Dashboard
                        </Link>
                    </li>
                    <li style={{ ...styles.menuItem, ...styles.active }}>
                        <Link to="/admin/pending-appointments" style={styles.link}>
                            <FaCalendarAlt style={{ marginRight: "10px" }} /> Pending Appointments
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <h1 style={styles.heading}>
                    <FaCalendarAlt style={{ marginRight: "10px" }} /> Pending Appointments
                </h1>

                {loading ? (
                    <div style={styles.loading}>Loading appointments...</div>
                ) : appointments.length > 0 ? (
                    <div style={styles.grid}>
                        {appointments.map((appointment) => (
                            <div key={appointment.id} style={styles.card}>
                                <h3 style={styles.patientName}>
                                    <FaUser style={{ marginRight: "10px" }} /> {appointment.name}
                                </h3>
                                <p>
                                    <FaCalendarAlt style={{ marginRight: "10px" }} /> 
                                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                                </p>
                                <p>
                                    <FaClock style={{ marginRight: "10px" }} /> 
                                    <strong>Time:</strong> {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p>
                                    <FaUserMd style={{ marginRight: "10px" }} /> 
                                    <strong>Doctor:</strong> {appointment.doctor?.name || "N/A"} ({appointment.doctor?.specialty?.name || "N/A"})
                                </p>
                                <p><strong>Reason:</strong> {appointment.reasonForVisit}</p>
                                <p><strong>Consultation Type:</strong> {appointment.consultationType}</p>
                                <p><strong>Preferred Mode:</strong> {appointment.preferredMode}</p>
                                <div style={styles.buttonGroup}>
                                    <button 
                                        style={styles.confirmButton} 
                                        onClick={() => handleConfirm(appointment.id)}
                                    >
                                        <FaCheck /> Confirm
                                    </button>
                                    <button 
                                        style={styles.cancelButton} 
                                        onClick={() => handleCancel(appointment.id)}
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.noAppointments}>
                        <p>No pending appointments found</p>
                        <Link to="/admin" style={styles.backButton}>
                            Back to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal CSS Styles
const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
    },
    sidebar: {
        width: "250px",
        backgroundColor: "#00796b",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "sticky",
        top: 0,
        height: "100vh",
    },
    logo: {
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "30px",
    },
    menu: {
        listStyle: "none",
        padding: "0",
        margin: 0,
    },
    menuItem: {
        padding: "15px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background 0.3s",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
    },
    active: {
        backgroundColor: "#004d40",
    },
    link: {
        textDecoration: "none",
        color: "white",
        display: "flex",
        alignItems: "center",
    },
    mainContent: {
        flex: 1,
        padding: "30px",
    },
    heading: {
        fontSize: "28px",
        color: "#00796b",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "20px",
    },
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        transition: "transform 0.3s",
        "&:hover": {
            transform: "translateY(-5px)",
        },
    },
    patientName: {
        fontSize: "20px",
        color: "#00796b",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
        gap: "10px",
    },
    confirmButton: {
        backgroundColor: "#388e3c",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flex: 1,
        justifyContent: "center",
        transition: "background 0.3s",
        "&:hover": {
            backgroundColor: "#2e7d32",
        },
    },
    cancelButton: {
        backgroundColor: "#d32f2f",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flex: 1,
        justifyContent: "center",
        transition: "background 0.3s",
        "&:hover": {
            backgroundColor: "#b71c1c",
        },
    },
    loading: {
        textAlign: "center",
        padding: "40px",
        fontSize: "18px",
        color: "#666",
    },
    noAppointments: {
        textAlign: "center",
        padding: "40px",
        fontSize: "18px",
        color: "#666",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    backButton: {
        display: "inline-block",
        textDecoration: "none",
        background: "#00796b",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        transition: "background 0.3s",
        "&:hover": {
            background: "#004d40",
        },
    },
};

export default PendingAppointments;