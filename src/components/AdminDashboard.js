import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaFilePrescription, FaCalendarCheck, FaUserPlus, FaSignOutAlt, FaAmbulance,  FaUserMd, FaHospitalUser } from 'react-icons/fa';
import './AdminDashboard.css'

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const appointmentsChartRef = useRef(null);
    const ratioChartRef = useRef(null);

    const [appointments, setAppointments] = useState([]);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalPatients, setTotalPatients] = useState(0);
    const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [chartData, setChartData] = useState({
        appointmentsByMonth: [],
        ratioData: {}
    });

    // Styles object
    const styles = {
        dashboard: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f5f7fa',
            fontFamily: "Times New Roman"
        },
        sidebar: {
            width: '250px',
            backgroundColor: '#008080',
            color: 'white',
            padding: '20px 0',
            boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            height: '100vh',
            zIndex: 1000,
            fontFamily:'Times New roman'
        },
        sidebarTitle: {
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            padding: '0 20px'
        },
        sidebarNav: {
            marginTop: '20px'
        },
        sidebarNavUl: {
            listStyle: 'none',
            padding: 0,
            margin: 0
        },
        sidebarNavLi: {
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            display: 'flex',
            alignItems: 'center'
        },
        sidebarNavLiHover: {
            backgroundColor: '#34495e'
        },
        navIcon: {
            marginRight: '10px',
            fontSize: '1.1rem'
        },
        noUnderline: {
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            width: '100%'
        },
        logout: {
            marginTop: 'auto',
            color: '#e74c3c',
            cursor: 'pointer'
        },
        mainContent: {
            flex: 1,
            marginLeft: '250px',
            padding: '30px',
            backgroundColor: '#f5f7fa'
        },
        cardsWrapper: {
            display: 'flex',
            gap: '20px',
            marginBottom: '30px'
        },
        cardsContainer: {
            display: 'flex',
            gap: '20px',
            flex: 3
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            flex: 1,
            textAlign: 'center',
            transition: 'transform 0.3s'
        },
        cardHover: {
            transform: 'translateY(-5px)'
        },
        emergencyCard: {
            backgroundColor: '#fff3cd',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            flex: 1,
            borderLeft: '5px solid #ffc107'
        },
        tablesContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '30px'
        },
        tableSection: {
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '15px'
        },
        tableTh: {
            backgroundColor: '#f8f9fa',
            padding: '12px',
            textAlign: 'left',
            borderBottom: '1px solid #dee2e6'
        },
        tableTd: {
            padding: '12px',
            borderBottom: '1px solid #dee2e6'
        },
        graphsContainer: {
            display: 'flex',
            gap: '20px'
        },
        graphContainer: {
            flex: 1,
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
        },
        chartWrapper: {
            position: 'relative',
            height: '300px',
            width: '100%'
        },
        clickPrompt: {
            textAlign: 'center',
            fontSize: '14px',
            color: '#00796b',
            marginTop: '10px'
        },
        sidebarTitle: {
            fontSize: '22px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#ffffff',
            marginBottom: '30px',
            padding: '15px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '5px',
            '&::before, &::after': {
              content: '"⚕"',
              fontSize: '18px'
            }
          }
    };

    useEffect(() => {
        fetchRecentDoctors();
        fetchChartData();
    }, []);

    useEffect(() => {
        if (chartData.appointmentsByMonth.length > 0 && chartData.ratioData.doctors !== undefined) {
            renderCharts();
        }
    }, [chartData]);

    useEffect(() => {
        fetchAppointments();
        fetchDoctorCount();
        fetchPatientCount();
        fetchTodayAppointmentsCount();
    }, []);

    const fetchChartData = async () => {
        try {
            const [appointmentsRes, ratioRes] = await Promise.all([
                axios.get("http://localhost:5000/api/admin/appointments-by-month"),
                axios.get("http://localhost:5000/api/admin/doctor-patient-ratio")
            ]);
            
            setChartData({
                appointmentsByMonth: appointmentsRes.data.data || [],
                ratioData: ratioRes.data.data || {}
            });
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
    };

    const renderCharts = () => {
        renderAppointmentsChart();
        renderRatioChart();
    };

    const renderAppointmentsChart = () => {
        const ctx = document.getElementById('appointmentsChart').getContext('2d');
        
        if (appointmentsChartRef.current) {
            appointmentsChartRef.current.destroy();
        }
        
        appointmentsChartRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.appointmentsByMonth.map(item => item.month),
                datasets: [{
                    data: chartData.appointmentsByMonth.map(item => item.count),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                        '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
                        '#E91E63', '#9C27B0', '#3F51B5', '#009688'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Appointments by Month',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    };

    const renderRatioChart = () => {
        const ctx = document.getElementById('ratioChart').getContext('2d');
        
        if (ratioChartRef.current) {
            ratioChartRef.current.destroy();
        }
        
        ratioChartRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Doctors', 'Patients'],
                datasets: [{
                    data: [chartData.ratioData.doctors, chartData.ratioData.patients],
                    backgroundColor: ['#36A2EB', '#FF6384']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Doctor-Patient Ratio',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    };

    const fetchRecentDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/recent-doctors");
            setRecentDoctors(response.data.data);
        } catch (error) {
            console.error("Error fetching recent doctors:", error);
        }
    };
    
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/get-pending-appointments");
            setAppointments(response.data.data);
        } catch (error) {
            console.error("Error fetching pending appointments:", error);
        }
    };

    const fetchDoctorCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/count-doctors");
            setTotalDoctors(response.data.totalDoctors);
        } catch (error) {
            console.error("Error fetching doctor count:", error);
        }
    };

    const fetchPatientCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/count-patients");
            setTotalPatients(response.data.totalPatients);
        } catch (error) {
            console.error("Error fetching patient count:", error);
        }
    };

    const fetchTodayAppointmentsCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/count-today-appointments");
            setTodayAppointmentsCount(response.data.totalAppointmentsToday);
        } catch (error) {
            console.error("Error fetching patient count:", error);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
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

    return (
        <div style={styles.dashboard}>
            <aside style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>MedXpert Admin</h2>
                <nav style={styles.sidebarNav}>
                    <ul style={styles.sidebarNavUl}>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/admin/register-user" style={styles.noUnderline}>
                                <FaUserPlus style={styles.navIcon} /> Register a New User
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/admin/prescriptions" style={styles.noUnderline}>
                                <FaFilePrescription style={styles.navIcon} /> EHR (View Prescriptions)
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/admin/appointments" style={styles.noUnderline}>
                                <FaCalendarCheck style={styles.navIcon} /> View Appointments
                            </Link>
                        </li>
                        <li style={styles.sidebarNavLi}>
                            <Link to="/admin/admin-doctor-list" style={styles.noUnderline}>
                                < FaUserMd style={styles.navIcon} /> Doctor List
                            </Link>
                        </li> 
                        <li style={styles.sidebarNavLi}>
                            <Link to="/admin/admin-patient-list" style={styles.noUnderline}>
                                <FaHospitalUser style={styles.navIcon} /> Patients List
                            </Link>
                        </li> 
                        <li style={styles.sidebarNavLi}>
                            <Link to="/admin/ambulance-monitoring" style={styles.noUnderline}>  
                                <FaAmbulance style={styles.navIcon} /> Ambulance Facilities
                            </Link>
                        </li>
                        <li style={{...styles.sidebarNavLi, ...styles.logout}} onClick={handleLogout}>
                            <FaSignOutAlt style={styles.navIcon} /> Logout
                        </li>
                    </ul>
                </nav>
            </aside>

            <main style={styles.mainContent}>
                <h1>Welcome, Admin!</h1>

                <div style={styles.cardsWrapper}>
                    <div style={styles.cardsContainer}>
                        <div style={styles.card}>
                            <h3>Registered Doctors</h3>
                            <p>{totalDoctors}</p>
                        </div>
                        <div style={styles.card}>
                            <h3>Registered Patients</h3>
                            <p>{totalPatients}</p>
                        </div>
                        <div style={styles.card}>
                            <h3>Today's Appointments</h3>
                            <p>{todayAppointmentsCount}</p>
                        </div>
                    </div>
                </div>

                <div style={styles.tablesContainer}>
                    <div style={styles.tableSection}>
                        <h2>Recent Doctor Registrations</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableTh}>ID</th>
                                    <th style={styles.tableTh}>Name</th>
                                    <th style={styles.tableTh}>Specialization</th>
                                    <th style={styles.tableTh}>Contact</th>
                                    <th style={styles.tableTh}>Registered On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentDoctors.length > 0 ? (
                                    recentDoctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td style={styles.tableTd}>{doctor.id}</td>
                                            <td style={styles.tableTd}>{doctor.name}</td>
                                            <td style={styles.tableTd}>{doctor.specialty?.name || "N/A"}</td>
                                            <td style={styles.tableTd}>{doctor.phone}</td>
                                            <td style={styles.tableTd}>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td style={styles.tableTd} colSpan="5">No recent doctor registrations</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div 
                        style={{...styles.tableSection, cursor: "pointer"}} 
                        onClick={() => navigate("/admin/pending-appointments")} 
                    >
                        <h2>Pending Appointments</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableTh}>Patient</th>
                                    <th style={styles.tableTh}>Doctor</th>
                                    <th style={styles.tableTh}>Specialization</th>
                                    <th style={styles.tableTh}>Date</th>
                                    <th style={styles.tableTh}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length > 0 ? (
                                    appointments.slice(0, 5).map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td style={styles.tableTd}>{appointment.name}</td>
                                            <td style={styles.tableTd}>{appointment.doctor.name}</td>
                                            <td style={styles.tableTd}>{appointment.doctor.specialty?.name || "N/A"}</td>
                                            <td style={styles.tableTd}>{new Date(appointment.date).toLocaleDateString()}</td>
                                            <td style={styles.tableTd}>{appointment.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td style={styles.tableTd} colSpan="5">No pending appointments</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <p style={styles.clickPrompt}>
                            Click to view all pending appointments
                        </p>
                    </div>
                </div>

                <div style={styles.graphsContainer}>
                    <div style={styles.graphContainer}>
                        <div style={styles.chartWrapper}>
                            <canvas id="appointmentsChart"></canvas>
                        </div>
                    </div>
                    <div style={styles.graphContainer}>
                        <div style={styles.chartWrapper}>
                            <canvas id="ratioChart"></canvas>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;