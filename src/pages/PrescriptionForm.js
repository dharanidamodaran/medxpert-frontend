import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrescriptionForm = () => {
    const { appointmentId } = useParams();
    const [formData, setFormData] = useState({
        medications: [{
            medicineName: '',
            dosage: '',
            instructions: '',
            duration: '',
            times: ''
        }],
    });
    const [loading, setLoading] = useState(true);
    const [allMedicines, setAllMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [showMedicineList, setShowMedicineList] = useState(false);
    const [activeMedIndex, setActiveMedIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("appointmentId inside useEffect:", appointmentId);

        const fetchAppointmentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/doctors/get-appointment-details/${appointmentId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();

                // Format the date
                const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                setFormData((prev) => ({
                    ...prev,
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    patientName: data.patient.name,
                    patientAge: data.age,
                    patientGender: data.gender,
                    doctorName: data.doctor.name,
                    reasonForVisit: data.reasonForVisit,
                    date: formattedDate,  // Use formatted date here
                    appointmentId: data.id,
                }));

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch appointment:', error);
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchAppointmentDetails();
        }
    }, [appointmentId]);

    useEffect(() => {
        // Fetch all medicines when component mounts
        const fetchAllMedicines = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/medicine/all-medicine');
                const data = await response.json();
                setAllMedicines(data);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchAllMedicines();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMedicationChange = (index, name, value) => {
        const updatedMedications = [...formData.medications];
        updatedMedications[index][name] = value;
        setFormData({ ...formData, medications: updatedMedications });
    };

    const handleTimeChange = (medIndex, value) => {
        const updatedMedications = [...formData.medications];
        updatedMedications[medIndex].times = value;
        setFormData({ ...formData, medications: updatedMedications });
    };


    const addMedicationField = () => {
        setFormData({
            ...formData,
            medications: [...formData.medications, {
                medicineName: '',
                dosage: '',
                instructions: '',
                duration: '',
                timesToBeTaken: '',
            }],
        });
    };

    const handleMedicineNameChange = (index, value) => {
        handleMedicationChange(index, 'medicineName', value);
        setActiveMedIndex(index);

        if (value.length > 0) {
            const filtered = allMedicines.filter(medicine =>
                medicine.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredMedicines(filtered);
            setShowMedicineList(true);
        } else {
            setShowMedicineList(false);
        }
    };

    const selectMedicine = (medicineName, index) => {
        handleMedicationChange(index, 'medicineName', medicineName);
        setShowMedicineList(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collect all form data, including additional fields
        const ehrData = {
            appointmentId: formData.appointmentId,
            diagnosis: formData.diagnosis,
            treatment: formData.treatment,
            medications: formData.medications, // Contains all medication details
            allergies: formData.allergies,
            medicalHistory: formData.medicalHistory,
            patientId: formData.patientId, // patientId fetched from appointment details
            doctorId: formData.doctorId,   // doctorId fetched from appointment details
            additionalNotes: formData.additionalNotes, // Additional notes field
        };

        try {
            // Send the data to the single API endpoint
            const response = await fetch('http://localhost:5000/api/ehr/create-ehr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ehrData), // Send the full data (EHR + prescription)
            });

            if (response.ok) {
                const data = await response.json();

                // Now trigger the appointment status update to "completed"
                const statusResponse = await fetch(`http://localhost:5000/api/doctors/appointment/complete/${formData.appointmentId}`, {
                    method: 'PUT', // Ensure it's a PUT request to update the status
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Prescription, EHR submitted, and appointment status updated to completed.',
                        confirmButtonColor: '#004d40',
                    }).then(() => {
                        // Redirect to the appointment viewing page after the popup is confirmed
                        navigate('/doctor/doctor-appointment-viewing');
                    });
                } else {
                    throw new Error('Failed to update appointment status');
                }
            } else {
                throw new Error('Failed to create prescription and EHR');
            }
        } catch (error) {
            console.error('Error submitting prescription and EHR:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while submitting.',
                confirmButtonColor: '#c62828',
            });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>MedXpert</h2>
                <ul style={styles.sidebarList}>
                    <li style={styles.sidebarItem}>Dashboard</li>
                    <li style={styles.sidebarItem}>Appointments</li>
                    <li style={styles.sidebarItem}>Patients</li>
                    <li style={styles.sidebarItem}>Prescriptions</li>
                    <li style={styles.sidebarItem}>Logout</li>
                </ul>
            </div>

            <div style={styles.formWrapper}>
                <h2 style={styles.heading}>Prescription Form</h2>

                {!loading && (
                    <div style={styles.infoBox}>
                        <p><strong>Patient Name :</strong> {formData.patientName} | Age: {formData.patientAge} | Gender: {formData.patientGender}</p>
                        <p><strong>Doctor:</strong> {formData.doctorName}</p>
                        <p><strong>Appointment Date:</strong> {formData.date}</p>
                        <p><strong>Reason for Visit:</strong> {formData.reasonForVisit}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Diagnosis:</label>
                    <textarea name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} style={styles.textarea} required />

                    <label style={styles.label}>Treatment:</label>
                    <textarea name="treatment" value={formData.treatment} onChange={handleInputChange} style={styles.textarea} required />

                    <label style={styles.label}>Medications:</label>
                    {formData.medications.map((med, index) => (
                        <div key={index} style={styles.medicationGroupContainer}>
                            <div style={styles.medicationGroup}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <input
                                        type="text"
                                        placeholder="Medicine Name"
                                        value={med.medicineName}
                                        onChange={(e) => handleMedicineNameChange(index, e.target.value)}
                                        style={styles.inputSmall}
                                        required
                                        onFocus={() => {
                                            setActiveMedIndex(index);
                                            if (med.medicineName.length > 0) {
                                                const filtered = allMedicines.filter(m =>
                                                    m.name.toLowerCase().includes(med.medicineName.toLowerCase())
                                                );
                                                setFilteredMedicines(filtered);
                                                setShowMedicineList(true);
                                            }
                                        }}
                                        onBlur={() => setTimeout(() => setShowMedicineList(false), 200)}
                                    />
                                    {showMedicineList && activeMedIndex === index && filteredMedicines.length > 0 && (
                                        <ul style={styles.medicineList}>
                                            {filteredMedicines.map((medicine) => (
                                                <li
                                                    key={medicine._id}
                                                    style={styles.medicineListItem}
                                                    onClick={() => selectMedicine(medicine.name, index)}
                                                >
                                                    {medicine.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Dosage"
                                    value={med.dosage}
                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                    style={styles.inputSmall}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Instructions"
                                    value={med.instructions}
                                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                    style={styles.inputSmall}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Duration"
                                    value={med.duration}
                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                    style={styles.inputSmall}
                                    required
                                />
                            </div>
                            <div style={styles.timeSection}>
                                <label style={styles.timeLabel}>Times to be taken:</label>
                                <select
                                    value={med.times || ""}
                                    onChange={(e) => handleTimeChange(index, e.target.value)}
                                    style={styles.inputSmall}
                                >
                                    <option value="">Select Time</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>

                        </div>
                    ))}
                    <button type="button" onClick={addMedicationField} style={styles.addButton}>+ Add Medication</button>

                    <label style={styles.label}>Allergies:</label>
                    <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} style={styles.input} />

                    <label style={styles.label}>Medical History:</label>
                    <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} style={styles.textarea} />

                    <label style={styles.label}>Additional Notes:</label>
                    <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} style={styles.textarea} />

                    <button type="submit" style={styles.submitButton}>Submit Prescription</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        fontFamily: '"Times New Roman", serif',
    },
    sidebar: {
        width: '230px',
        backgroundColor: '#004d40',
        color: '#ffffff',
        padding: '20px',
        height: '100vh',
    },
    sidebarTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
    },
    sidebarList: {
        listStyle: 'none',
        padding: 0,
    },
    sidebarItem: {
        marginBottom: '20px',
        cursor: 'pointer',
        fontSize: '18px',
    },
    formWrapper: {
        flex: 1,
        padding: '30px',
        overflowY: 'auto',
    },
    heading: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    infoBox: {
        backgroundColor: '#e0f2f1',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
        fontSize: '16px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    label: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    input: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    textarea: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        minHeight: '60px',
    },
    medicationGroupContainer: {
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    },
    medicationGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '10px',
    },
    inputSmall: {
        flex: '1',
        minWidth: '150px',
        padding: '6px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    timeSection: {
        marginTop: '5px',
    },
    timeLabel: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '10px',
    },
    timeCheckboxes: {
        display: 'flex',
        gap: '15px',
        marginTop: '5px',
        flexWrap: 'wrap',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '14px',
    },
    checkbox: {
        margin: 0,
    },
    addButton: {
        backgroundColor: '#004d40',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        fontSize: '14px',
    },
    submitButton: {
        backgroundColor: '#00796b',
        color: '#fff',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
    },
    medicineList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: 1000,
        listStyle: 'none',
        padding: 0,
        margin: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    medicineListItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
    },
    medicineListItemHover: {
        backgroundColor: '#f5f5f5',
    },
};

export default PrescriptionForm;