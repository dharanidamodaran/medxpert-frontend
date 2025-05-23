import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaBars, FaCalendarAlt } from 'react-icons/fa';

const PatientPrescriptionView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state && location.state.ehr) {
            const ehrList = location.state.ehr;
            const filtered = ehrList.filter(ehr => ehr.medications && ehr.medications.length > 0);
            setPrescriptions(filtered);
        }
    }, [location.state]);

    const handleBuyMedicine = (ehrId, medications) => {
        // Find the full prescription data for this ehrId
        const prescription = prescriptions.find(p => p._id === ehrId || p.id === ehrId);
        
        if (!prescription) {
            console.error("Prescription not found for ehrId:", ehrId);
            return;
        }

        navigate(`/patient/buy-medicine`, { 
            state: { 
                medications,
                ehrId,
                prescriptionData: {
                    doctorName: prescription.doctor?.name || 'N/A',
                    doctorSpecialty: prescription.doctor?.specialty?.name || 'N/A',
                    appointmentDate: prescription.appointment?.date 
                        ? new Date(prescription.appointment.date).toLocaleDateString() 
                        : 'N/A',
                    diagnosis: prescription.diagnosis || 'N/A',
                    treatment: prescription.treatment || 'N/A',
                    labReports: prescription.labReports || 'N/A',
                    medicalHistory: prescription.medicalHistory || 'N/A',
                    allergies: prescription.allergies || 'N/A'
                }
            } 
        });
    };

    const handleDownloadPdf = async (ehrId) => {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("token");

        try {
            const res = await axios.get(`http://localhost:5000/api/ehr/download-ehr/${ehrId}/pdf`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const contentType = res.headers['content-type'];
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error("Server didn't return a valid PDF.");
            }

            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription_${ehrId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("PDF Download Error:", error);
            setError(`Failed to download PDF: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            <style>
                {`
                @media screen and (max-width: 768px) {
                    .medxpert-sidebar {
                        position: fixed;
                        left: 0;
                        top: 0;
                        height: 100vh;
                        width: 220px;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        z-index: 999;
                    }

                    .medxpert-sidebar.open {
                        transform: translateX(0);
                    }

                    .hamburger {
                        display: block;
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        font-size: 24px;
                        color: #00796b;
                        background: white;
                        padding: 8px;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        z-index: 1000;
                        cursor: pointer;
                    }

                    .medxpert-content {
                        padding-left: 10px !important;
                        padding-right: 10px;
                        margin-top: 60px;
                    }

                    .prescription-card {
                        width: 95% !important;
                    }

                    .buyAllButton {
                        width: 100%;
                        font-size: 16px;
                    }
                }

                @media screen and (min-width: 769px) {
                    .hamburger {
                        display: none;
                    }

                    .medxpert-sidebar {
                        transform: translateX(0) !important;
                    }
                }
            `}
            </style>

            <div className="hamburger" onClick={toggleSidebar}>
                ☰
            </div>

            <div className="medxpert-container" style={{
                ...styles.container,
                backgroundImage: 'url("https://images.pexels.com/photos/12512671/pexels-photo-12512671.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className={`medxpert-sidebar ${sidebarOpen ? 'open' : ''}`} style={styles.sidebar}>
                    <div style={styles.logo}>MedXpert</div>
                    <ul style={styles.menu}>
                        <li style={styles.menuItem}>
                            <Link to="/patient" style={styles.link}>
                                <FaBars /> Dashboard
                            </Link>
                        </li>
                        <li style={styles.menuItem}>
                            <Link to="/patient/appointments" style={styles.link}>
                                <FaCalendarAlt /> Appointments
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="medxpert-content" style={styles.content}>
                    <h2 style={styles.heading}>Prescription Details</h2>
                    {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                    {prescriptions.map((prescription) => (
                        <div
                            key={prescription._id || prescription.id}
                            className="prescription-card"
                            style={styles.prescriptionCard}
                        >
                            <p><strong>Doctor:</strong> {prescription.doctor?.name || 'N/A'}</p>
                            <p><strong>Specialization:</strong> {prescription.doctor?.specialty?.name || 'N/A'}</p>
                            <p><strong>Appointment Date:</strong>
                                {prescription.appointment?.date
                                    ? new Date(prescription.appointment.date).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                            <p><strong>Diagnosis:</strong> {prescription.diagnosis || 'N/A'}</p>
                            <p><strong>Treatment:</strong> {prescription.treatment || 'N/A'}</p>
                            <p><strong>Lab Reports:</strong> {prescription.labReports || 'N/A'}</p>
                            <p><strong>Medical History:</strong> {prescription.medicalHistory || 'N/A'}</p>
                            <p><strong>Allergies:</strong> {prescription.allergies || 'N/A'}</p>

                            <p><strong>Medications:</strong></p>
                            <ul>
                                {prescription.medications?.map((med, index) => (
                                    <li key={index}>
                                        <strong>{med.medicineName}</strong> –
                                        Dosage: {med.dosage},
                                        Duration: {med.duration} days
                                        {med.instructions && <> – Instructions: {med.instructions}</>}
                                    </li>
                                ))}
                            </ul>

                            <div style={styles.buttonContainer}>
                                <button
                                    style={styles.buyButton}
                                    onClick={() => handleBuyMedicine(prescription._id || prescription.id, prescription.medications)}
                                >
                                    🛒 Buy Medicines
                                </button>

                                <button
                                    style={styles.downloadButton}
                                    onClick={() => handleDownloadPdf(prescription._id || prescription.id)}
                                    disabled={loading}
                                >
                                    {loading ? '⏳ Downloading...' : '📄 Download PDF'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'Times New Roman, serif',
    },
    sidebar: {
        position: 'fixed',
        width: '250px',
        height: '100vh',
        backgroundColor: '#00796b',
        color: 'white',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        zIndex: 1000,
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '40px',
    },
    menu: {
        listStyle: 'none',
        padding: '0',
        width: '100%',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '15px',
        fontSize: '18px',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background 0.3s',
    },
    link: {
        textDecoration: 'none',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '18px',
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        paddingLeft: '280px',
        textAlign: 'center',
        color: '#333',
    },
    heading: {
        fontSize: '32px',
        color: '#00796b',
        marginBottom: '30px',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
    },
    prescriptionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.61)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        marginBottom: '25px',
        width: '45%',
        minWidth: '350px',
        textAlign: 'left',
        transition: 'transform 0.3s ease-in-out',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    },
    buyButton: {
        backgroundColor: '#00796b',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        flex: 1,
        marginRight: '10px'
    },
    downloadButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s ease',
        flex: 1
    },
    buyAllContainer: {
        textAlign: 'center',
        marginTop: '30px',
    },
    buyAllButton: {
        backgroundColor: '#ff9800',
        color: '#fff',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
    },
};

export default PatientPrescriptionView;