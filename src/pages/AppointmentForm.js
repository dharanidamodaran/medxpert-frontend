import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaChevronLeft, FaHome } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',       
        patientId: '', // Dynamic patientId
        userId: '',     // Dynamic userId
        contactNumber: '',
        email: '',
        specialization: '',
        doctorName: '',
        consultationType: 'In-Person',
        preferredGender: '',
        appointmentDate: '',
        appointmentTime: '',
        reasonForVisit: '',
        communicationMode: 'Email',
        age: '',          // Manually entered age
        gender: '',
    });

    const navigate = useNavigate();
    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // Fetch patient details dynamically using the patientId
    useEffect(() => {
        const storedUserId = parseInt(sessionStorage.getItem("userId"), 10);
        const storedPatientId = parseInt(sessionStorage.getItem("patientId"), 10);
        const storedUserName = sessionStorage.getItem("userName");
        const storedPhone = sessionStorage.getItem("phone");
        const storedEmail = sessionStorage.getItem("email");
        const storedGender = sessionStorage.getItem("gender");
        const storedDob = sessionStorage.getItem("dateofBirth");
    
        // Calculate Age from Date of Birth
        const calculateAge = (dob) => {
            if (!dob) return '';
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };
    
        if (!isNaN(storedUserId) && !isNaN(storedPatientId)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                userId: storedUserId,
                patientId: storedPatientId,
                fullName: storedUserName || '',
                contactNumber: storedPhone || '',
                email: storedEmail || '',
                gender: storedGender || '',
                age: calculateAge(storedDob),
            }));
        }
    }, []);
    

    useEffect(() => {
        // Fetch specializations when component mounts
        fetch("http://localhost:5000/api/admin/get-specializations")
            .then(res => res.json())
            .then(data => setSpecializations(data))
            .catch(err => console.error("Error fetching specializations:", err));
    }, []);

    useEffect(() => {
        if (formData.specialization) {
            // Fetch doctors when specialization changes
            fetch(`http://localhost:5000/api/doctors/get-doctors?specialization=${formData.specialization}`)
                .then(res => res.json())
                .then(data => setDoctors(data))
                .catch(err => console.error("Error fetching doctors:", err));
        } else {
            setDoctors([]);
        }
    }, [formData.specialization]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName.trim()) {
            Swal.fire("Error", "Full Name is required!", "error");
            return;
        }
    
        const appointmentData = {
            patientId: formData.patientId || "", 
            doctorId: parseInt(formData.doctorName), 
            name: formData.fullName.trim(),
            age: formData.age || "N/A",
            gender: formData.gender || "N/A",
            reasonForVisit: formData.reasonForVisit || "N/A",
            consultationType: formData.consultationType || "In-Person",
            date: `${formData.appointmentDate}T${formData.appointmentTime}:00.000Z`,
            preferredMode: formData.communicationMode || "Email"
        };
    
        try {
            const response = await fetch("http://localhost:5000/api/appointment/book-appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentData)
            });
    
            const result = await response.json();
    
            if (response.ok) {
                Swal.fire({
                    title: "Success!",
                    text: "Appointment booked successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate("/patient"); // Redirect to dashboard
                });
            } else {
                Swal.fire("Error", result.error || "Something went wrong!", "error");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarHeading}>MedXpert</h2>
                <div style={styles.sidebarLinks}>
                    <a href="/patient" style={styles.link}>
                        <FaHome style={styles.icon} /> Dashboard
                    </a>
                    <a href="/patient/appointments" style={styles.link}>
                        <FaChevronLeft style={styles.icon} /> Back to Appointments
                    </a>
                </div>
            </div>

            <div style={styles.mainContent}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>
                        <FaCalendarCheck style={{ fontSize: '30px', marginRight: '10px' }} />
                        Book an Appointment
                    </h1>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.section}>
                            <label style={styles.label}>Full Name:</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={styles.input} />

                            <label style={styles.label}>Contact:</label>
                            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} style={styles.input} />

                            <label style={styles.label}>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
                        </div>
                        <div style={styles.section}>
                            <label style={styles.label}>Age:</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} style={styles.input} />
                            </div>
                            <label style={styles.label}>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            
                        <div style={styles.section}>
                            <label style={styles.label}>Specialization:</label>
                            <select name="specialization" value={formData.specialization} onChange={handleChange} style={styles.select}>
                                <option value="">Select Specialization</option>
                                {specializations.map((spec) => (
                                    <option key={spec.id} value={spec.name}>{spec.name}</option>
                                ))}
                            </select>

                            <label style={styles.label}>Doctor:</label>
                            <select name="doctorName" value={formData.doctorName} onChange={handleChange} style={styles.select}>
                                <option value="">Select Doctor</option>
                                {doctors.map((doc) => (
                                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                                ))}
                            </select>

                            <label style={styles.label}>Consultation Type:</label>
                            <select name="consultationType" value={formData.consultationType} onChange={handleChange} style={styles.select}>
                                <option value="In-Person">In-Person</option>
                                <option value="Video Call">Video Call</option>
                                <option value="Phone Call">Phone Call</option>
                            </select>
                        </div>

                        <div style={styles.section}>
                            <label style={styles.label}>Date:</label>
                            <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} style={styles.input} />

                            <label style={styles.label}>Time:</label>
                            <input type="time" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} style={styles.input} />

                            <label style={styles.label}>Reason for Visit:</label>
                            <textarea name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} style={styles.textarea} />

                            <label style={styles.label}>Preferred Mode of Communication:</label>
                            <select name="communicationMode" value={formData.communicationMode} onChange={handleChange} style={styles.select}>
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                                <option value="Phone Call">Phone Call</option>
                            </select>
                        </div>

                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.submitButton}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};



const styles = {
    mainContent: {
        flex: 1,
        padding: '40px',
        backgroundColor: '#f9f9f9',
        backgroundImage: 'url("https://images.pexels.com/photos/3952232/pexels-photo-3952232.jpeg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    
    
    container: {
        display: 'flex',
        fontFamily: '"Times New Roman", serif',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#008080',
        color: '#fff',
        padding: '30px 20px',
    },
    sidebarHeading: {
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
    },
    sidebarLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        marginRight: '10px',
    },
    // mainContent: {
    //     flex: 1,
    //     padding: '40px',
    //     backgroundColor: '#f9f9f9',
    // },
    card: {
        backgroundColor:'rgba(255, 255, 255, 0.63)',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: 'auto',
    },
    heading: {
        fontSize: '28px',
        color: '#008080',
        marginBottom: '25px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    section: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
        width: '100%',
    },
    select: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#008080',
        color: '#fff',
        padding: '12px 25px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default AppointmentForm;