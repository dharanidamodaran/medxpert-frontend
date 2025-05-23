// 📄 src/pages/StaffRegistration.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        gender: '',
        address: '',
        designation: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Staff Data:', formData);
        alert('Staff Registered Successfully!');
        navigate('/');  // Redirect to home or other page after submission
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Staff Registration</h2>
                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <label style={styles.label}>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter staff name"
                        style={styles.input}
                        required
                    />

                    {/* Email */}
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter staff email"
                        style={styles.input}
                        required
                    />

                    {/* Password */}
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        style={styles.input}
                        required
                    />

                    {/* DOB */}
                    <label style={styles.label}>Date of Birth:</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    {/* Gender */}
                    <label style={styles.label}>Gender:</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* Address */}
                    <label style={styles.label}>Address:</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter staff address"
                        style={styles.textarea}
                        required
                    />

                    {/* Designation */}
                    <label style={styles.label}>Designation:</label>
                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Select Designation</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="Lab Technician">Lab Technician</option>
                        <option value="Receptionist">Receptionist</option>
                    </select>

                    {/* Submit Button */}
                    <button type="submit" style={styles.submitButton}>Register Staff</button>
                </form>
            </div>
        </div>
    );
};

export default StaffRegistration;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'url("../src/assets/images/medical.jpg") no-repeat center center/cover',
        fontFamily: 'Times New Roman, serif',
        padding: '40px 20px',
        boxSizing: 'border-box',
    },
    card: {
        width: '90%',
        maxWidth: '600px',
        padding: '30px',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
    },
    heading: {
        fontSize: '32px',
        color: '#00796b',
        textAlign: 'center',
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '18px',
        color: '#333',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        minHeight: '100px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
        marginBottom: '20px',
    },
    select: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
        marginBottom: '20px',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#00796b',
        color: '#fff',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '8px',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
    submitButtonHover: {
        backgroundColor: '#005a4f',
    }
};
