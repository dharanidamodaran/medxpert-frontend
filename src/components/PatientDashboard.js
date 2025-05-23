import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaNotesMedical, FaClipboardList, FaSignOutAlt, FaXRay, FaRegCalendarPlus } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientDashboard = () => {
    const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [healthData, setHealthData] = useState(null);
    const navigate = useNavigate();

    const allPatientsHealthData = [
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [120, 75, 90, 180] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [110, 80, 85, 150] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [130, 72, 95, 200] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [135, 78, 88, 160] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [115, 70, 92, 170] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [125, 85, 91, 190] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [128, 76, 80, 180] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [122, 70, 85, 160] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [118, 78, 87, 155] },
        { labels: ['Blood Pressure', 'Heart Rate', 'Glucose Level', 'Cholesterol'], data: [120, 72, 93, 165] },
    ];

    const healthTips = [
        {
            tip: "Stay hydrated by drinking at least 8 glasses of water daily.",
            image: "https://cdn-icons-png.flaticon.com/512/4221/4221419.png"
        },
        {
            tip: "Get at least 7-8 hours of sleep each night.",
            image: "https://cdn-icons-png.flaticon.com/512/3149/3149578.png"
        },
        {
            tip: "Include fruits and vegetables in your meals.",
            image: "https://cdn-icons-png.flaticon.com/512/732/732157.png"
        },
        {
            tip: "Exercise regularly for at least 30 minutes a day.",
            image: "https://cdn-icons-png.flaticon.com/512/888/888879.png"
        },
        {
            tip: "Manage stress through meditation or breathing exercises.",
            image: "https://cdn-icons-png.flaticon.com/512/3175/3175739.png"
        },
        {
            tip: "Avoid smoking and excessive alcohol consumption.",
            image: "https://cdn-icons-png.flaticon.com/512/2878/2878951.png"
        },
        {
            tip: "Schedule regular health check-ups.",
            image: "https://cdn-icons-png.flaticon.com/512/2565/2565530.png"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % healthTips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAppointmentCount = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/patients/${patientId}/upcoming-appointments/count`);
            if (response.status === 200) {
                setUpcomingAppointmentsCount(response.data.upcomingAppointmentsCount);
            }
        } catch (error) {
            console.error("Error fetching upcoming appointment count:", error);
        }
    };

    const fetchPatientDetails = async () => {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            Swal.fire("Error", "User ID not found. Please log in again.", "error");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/patients/details/${userId}`);
            if (response.status === 200) {
                const patientData = response.data.patientDetails;
                sessionStorage.setItem("patientId", patientData.id);
                await fetchAppointmentCount(patientData.id);
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            Swal.fire({
                title: "Patient Profile Not Found",
                text: "Please complete your registration.",
                icon: "warning",
                confirmButtonText: "Go to Registration",
            }).then(() => {
                navigate("/patient/patient-registration");
            });
        }
    };

    useEffect(() => {
        fetchPatientDetails();

        const userId = parseInt(sessionStorage.getItem("userId"));
        if (userId && userId >= 1 && userId <= 10) {
            const selectedPatientData = allPatientsHealthData[userId - 1];
            setHealthData({
                labels: selectedPatientData.labels,
                datasets: [
                    {
                        label: 'Health Stats',
                        data: selectedPatientData.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
                        borderColor: '#00796b',
                        borderWidth: 2,
                    },
                ],
            });
        }
    }, [navigate]);

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

    const handleMedicalHistoryClick = async () => {
        try {
            const patientId = sessionStorage.getItem("patientId");
            const response = await axios.get(`http://localhost:5000/api/ehr/get-ehr-id/${patientId}`);
            navigate('/patient/patient-prescription', { state: { ehr: response.data } });
        } catch (err) {
            console.error("Failed to fetch EHR data:", err);
        }
    };

    if (!healthData) {
        return <div>Loading your dashboard...</div>;
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                <h2 style={sidebarHeaderStyle}>Patient Dashboard</h2>

                <a href="#" style={linkStyle} onClick={() => navigate('/patient/patient-registration')}>
                    <FaUser style={iconStyle} /> Profile
                </a>
                <a href="/patient/appointment-form" style={linkStyle}>
                    <FaRegCalendarPlus style={iconStyle} /> Book Appointment
                </a>
                <a href="/patient/appointments" style={linkStyle}>
                    <FaCalendarAlt style={iconStyle} /> View Appointments
                </a>
                <a href="#" style={linkStyle} onClick={handleMedicalHistoryClick}>
                    <FaNotesMedical style={iconStyle} /> Medical History
                </a>
                <a href="/patient/patient-order-page" style={linkStyle}>
                    <FaClipboardList style={iconStyle} /> Orders
                </a>
                <a href="/patient/scan-patient" style={linkStyle}>
                    <FaXRay style={iconStyle} /> Scans
                </a>
                <a href="#" style={linkStyle} onClick={handleLogout}>
                    <FaSignOutAlt style={iconStyle} /> Logout
                </a>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f4f4' }}>
                <h1 style={mainHeaderStyle}>
                    Welcome, {sessionStorage.getItem("userName") || "Patient"}!
                </h1>

                {/* Cards */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <div style={cardStyle}>
                        <FaCalendarAlt size={40} color="#00796b" />
                        <p>Upcoming Appointments: <strong>{upcomingAppointmentsCount}</strong></p>
                    </div>
                    <div style={cardStyle}>
                        <FaNotesMedical size={40} color="#00796b" />
                        <p>Medical Records: <strong>12</strong></p>
                    </div>
                </div>

                {/* Health Tips and Health Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div style={tipsCardStyle}>
                        <h3 style={graphHeaderStyle}>Health Tips</h3>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                            <img
                                src={healthTips[currentTipIndex].image}
                                alt="Health Tip"
                                style={{ width: '60px', height: '60px', marginRight: '15px' }}
                            />
                            <p style={{ fontFamily: 'Times New Roman', fontSize: '18px' }}>
                                {healthTips[currentTipIndex].tip}
                            </p>
                        </div>
                    </div>

                    <div style={graphCardStyle}>
                        <h3 style={graphHeaderStyle}>Health Stats</h3>
                        <Line data={healthData} />
                    </div>
                </div>
            </div>
        </div>
    );
};
// STYLES

const sidebarStyle = {
    width: '250px',
    backgroundColor: '#004d40',
    color: '#fff',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)',
    height: '100vh',
    fontFamily: 'Times New Roman',
};

const sidebarHeaderStyle = {
    fontSize: '26px',
    marginBottom: '40px',
    color: '#f0f0f0',
};

const linkStyle = {
    color: '#f0f0f0',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '12px 0',
    display: 'flex',
    alignItems: 'center',
    transition: '0.3s',
    fontFamily: 'Times New Roman',
    width: '100%',
};

const iconStyle = {
    marginRight: '12px',
};

const mainHeaderStyle = {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#00796b',
    fontFamily: 'Times New Roman',
};

const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: '120px',
    backgroundColor: '#e0f2f1',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    fontSize: '18px',
    fontFamily: 'Times New Roman',
};

const graphCardStyle = {
    width: '48%',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
};

const tipsCardStyle = {
    width: '48%',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
};

const graphHeaderStyle = {
    fontFamily: 'Times New Roman',
    color: '#00796b',
};

export default PatientDashboard;
