import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [monthlyAppointments, setMonthlyAppointments] = useState(0);
    const [upcomingAppointments, setUpcomingAppointments] = useState(0);
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchDoctorDashboardData = async () => {
            const userId = sessionStorage.getItem("userId");
            console.log("Fetched from sessionStorage:", userId);

            if (!userId || isNaN(userId)) {
                console.error("Invalid or missing userId");
                return;
            }

            try {
                // Fetch profile
                const profileRes = await axios.get(`http://localhost:5000/api/doctors/doctor-profile/${userId}`);
                sessionStorage.setItem("doctorDetails", JSON.stringify(profileRes.data));

                // Fetch appointment count for the current month
                const countRes = await axios.get(`http://localhost:5000/api/doctors/appointments/count/monthly/${userId}`);
                setMonthlyAppointments(countRes.data.appointmentCount || 0);

                // Fetch upcoming appointment count
                const statusRes = await axios.get(`http://localhost:5000/api/doctors/appointments/status-count/${userId}`);
                setUpcomingAppointments(statusRes.data.upcomingAppointments || 0);

                // Fetch recent appointments
                const recentRes = await axios.get(`http://localhost:5000/api/doctors/appointments/recent/${userId}`);
                setRecentAppointments(recentRes.data || []);
                
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load dashboard data!',
                });
            } finally {
                setIsLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchDoctorDashboardData();
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        Swal.fire({
            title: "Logged Out!",
            text: "You have successfully logged out.",
            icon: "success",
            confirmButtonText: "OK",
        }).then(() => {
            navigate('/');
        });
    };

    // Function to format date (only date, no time)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Only return the date, no time
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.heading}>Doctor Dashboard</h2>
                <Link to="/doctor/doctor-registration" style={styles.link}>👤 Profile</Link>
                <Link to="/doctor/patient-view" style={styles.link}>👩‍⚕️ View Patient Records</Link>
                <Link to="/doctor/appointment-viewing" style={styles.link}>📅 View Appointments</Link>
                 <Link to="/doctor/prescription-view" style={styles.link}>📄 View EHR</Link> 
                <Link to="/video-audio-chat" style={styles.link}>💬 Chat</Link>
                <span style={{ ...styles.link, cursor: 'pointer' }} onClick={handleLogout}>🚪 Logout</span>
            </div>

            <div style={styles.main}>
                <h1 style={styles.title}>
                    Welcome, {sessionStorage.getItem("userName") || "Doctor"}!
                </h1>

                {isLoading ? (
                    <div style={styles.loader}>Loading...</div> // Show loader while data is being fetched
                ) : (
                    <>
                        <div style={styles.cardContainer}>
                            <div style={styles.card}>
                                <h3>Total Appointments this Month</h3>
                                <p>{monthlyAppointments}</p>
                            </div>
                            <div style={styles.card}>
                                <h3>Upcoming Appointments</h3>
                                <p>{upcomingAppointments}</p>
                            </div>
                        </div>

                        <h2 style={styles.sectionTitle}>Recent Appointments</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr><th style={styles.th}>Patient</th><th style={styles.th}>Date</th><th style={styles.th}>Reason for Visit</th></tr>
                            </thead>
                            <tbody>
                                {recentAppointments.map((appt) => {
                                    const formattedDate = formatDate(appt.date);
                                    return (
                                        <tr key={appt.id}>
                                            <td style={styles.td}>{appt.name}</td>
                                            <td style={styles.td}>{formattedDate}</td>
                                            <td style={styles.td}>{appt.reasonForVisit}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: "'Times New Roman', serif" },
    sidebar: {
        width: '250px', backgroundColor: '#00796b', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '20px',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)', gap: '20px'
    },
    heading: { fontSize: '24px', marginBottom: '20px', textAlign: 'center' },
    link: { fontSize: '18px', textDecoration: 'none', color: '#fff', transition: '0.3s' },
    main: { flex: 1, padding: '30px', backgroundColor: '#f4f4f4', overflowY: 'auto' },
    title: { fontSize: '28px', marginBottom: '20px', color: '#00796b' },
    cardContainer: { display: 'flex', justifyContent: 'space-around', marginBottom: '30px' },
    card: {
        backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px', padding: '20px', textAlign: 'center',
        width: '30%', transition: '0.3s'
    },
    sectionTitle: { fontSize: '22px', margin: '20px 0', color: '#00796b' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '30px' },
    th: { backgroundColor: '#00796b', color: '#fff', padding: '10px', textAlign: 'left' },
    td: { borderBottom: '1px solid #ccc', padding: '10px' },
    loader: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: '24px', color: '#00796b'
    }
};

export default DoctorDashboard;
