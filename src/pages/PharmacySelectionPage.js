import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PharmacySelectionPage = () => {
    const navigate = useNavigate();
    
    const [search, setSearch] = useState('');
    const [pharmacies, setPharmacies] = useState([
        { id: 1, name: 'HealthPlus Pharmacy', distance: 3.2, available: true },
        { id: 2, name: 'MediCare Pharmacy', distance: 4.1, available: true },
        { id: 3, name: 'GoodHealth Pharmacy', distance: 5.0, available: false },
        { id: 4, name: 'LifeCare Pharmacy', distance: 2.8, available: true },
        { id: 5, name: 'Wellness Pharmacy', distance: 4.7, available: false }
    ]);

    const handleSelectPharmacy = (id) => {
        navigate(`/payment?pharmacyId=${id}`);  // Navigate to payment page
    };

    const filteredPharmacies = pharmacies.filter((pharmacy) =>
        pharmacy.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Select Pharmacy</h2>

                {/* Search Bar */}
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search pharmacy..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                    <FaSearch style={styles.searchIcon} />
                </div>

                <div style={styles.pharmacyList}>
                    {filteredPharmacies.length > 0 ? (
                        filteredPharmacies.map((pharmacy) => (
                            <div key={pharmacy.id} style={styles.pharmacyCard}>
                                <div style={styles.info}>
                                    <h3 style={styles.pharmacyName}>{pharmacy.name}</h3>
                                    <p style={styles.distance}>
                                        <FaMapMarkerAlt /> {pharmacy.distance} km away
                                    </p>
                                    <p style={pharmacy.available ? styles.available : styles.unavailable}>
                                        {pharmacy.available ? <FaCheckCircle /> : <FaTimesCircle />}
                                        {pharmacy.available ? ' Available' : ' Out of Stock'}
                                    </p>
                                </div>
                                <button
                                    style={styles.selectButton}
                                    onClick={() => handleSelectPharmacy(pharmacy.id)}
                                    disabled={!pharmacy.available}
                                >
                                    Select
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={styles.noResults}>No pharmacies found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PharmacySelectionPage;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f2f2f2',
        fontFamily: 'Times New Roman, serif'
    },
    card: {
        maxWidth: '1200px',
        width: '90%',
        padding: '30px',
        background: 'white',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        margin: '40px 0'
    },
    heading: {
        fontSize: '32px',
        color: '#00796b',
        textAlign: 'center',
        marginBottom: '20px'
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
    },
    searchInput: {
        width: '100%',
        padding: '10px 15px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '6px'
    },
    searchIcon: {
        color: '#00796b',
        fontSize: '20px',
        marginLeft: '-30px',
        cursor: 'pointer'
    },
    pharmacyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    pharmacyCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    pharmacyName: {
        fontSize: '20px',
        color: '#00796b',
        margin: '0'
    },
    distance: {
        fontSize: '16px',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    available: {
        color: 'green',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    unavailable: {
        color: 'red',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    selectButton: {
        background: '#00796b',
        color: 'white',
        border: 'none',
        padding: '10px 25px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s'
    },
    selectButtonHover: {
        background: '#005a4f'
    },
    noResults: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#555'
    }
};
