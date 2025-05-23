import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye } from 'react-icons/fa';
import './DoctorPrescriptionView.css';  // Import the CSS

const DoctorPrescriptionView = () => {
    const navigate = useNavigate();

    // Mock data for testing
    const mockPrescriptions = [
        { id: 'PRES123', patient: 'John Doe', date: '2025-03-27', diagnosis: 'Flu', medications: 'Paracetamol, Vitamin C' },
        { id: 'PRES124', patient: 'Alice Smith', date: '2025-03-28', diagnosis: 'Migraine', medications: 'Ibuprofen, Caffeine' },
        { id: 'PRES125', patient: 'Michael Johnson', date: '2025-03-29', diagnosis: 'Fever', medications: 'Dolo 650, ORS' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPrescriptions, setFilteredPrescriptions] = useState(mockPrescriptions);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = mockPrescriptions.filter(pres =>
            pres.patient.toLowerCase().includes(term) ||
            pres.id.toLowerCase().includes(term)
        );
        setFilteredPrescriptions(filtered);
    };

    const handleViewDetails = (id) => {
        navigate(`/doctor/prescription-details/${id}`);  // Navigate to detailed view
    };

    return (
        <div className="doctor-prescription-container">
            <h2 className="doctor-title">My Patients' Prescriptions</h2>

            {/* Doctor Info */}
            <div className="doctor-info">
                <label>Doctor Name:</label>
                <input type="text" value="Dr. Smith" disabled className="doctor-input" />
            </div>

            {/* Search */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Patient Name or ID"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button className="search-btn">
                    <FaSearch />
                </button>
            </div>

            {/* Prescription Table */}
            <div className="prescription-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Diagnosis</th>
                            <th>Medications</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map((prescription) => (
                                <tr key={prescription.id}>
                                    <td>{prescription.id}</td>
                                    <td>{prescription.patient}</td>
                                    <td>{prescription.date}</td>
                                    <td>{prescription.diagnosis}</td>
                                    <td>{prescription.medications}</td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewDetails(prescription.id)}
                                        >
                                            <FaEye /> View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">No Prescriptions Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorPrescriptionView;
