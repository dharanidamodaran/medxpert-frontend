import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const PharmacyMap = () => {
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);

    // ✅ Mock pharmacy data (backend will give real data)
    const pharmacies = [
        { id: 1, name: "MediCare Pharmacy", lat: 12.9716, lng: 77.5946, address: "123 Main St", distance: "2.5 km" },
        { id: 2, name: "HealthPlus", lat: 12.9757, lng: 77.6050, address: "456 Elm St", distance: "3.2 km" },
        { id: 3, name: "PharmaCare", lat: 12.9789, lng: 77.6115, address: "789 Pine St", distance: "4.8 km" }
    ];

    // ✅ Map container style
    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    // ✅ Map center (user's location)
    const center = {
        lat: 12.9716,  // Mock user location
        lng: 77.5946
    };

    // ✅ Handle pharmacy selection
    const handleSelectPharmacy = (pharmacy) => {
        console.log("Selected Pharmacy:", pharmacy);
        alert(`Selected Pharmacy: ${pharmacy.name}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Nearby Pharmacies</h2>

            {/* Google Map */}
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                >
                    {pharmacies.map((pharmacy) => (
                        <Marker
                            key={pharmacy.id}
                            position={{ lat: pharmacy.lat, lng: pharmacy.lng }}
                            onClick={() => setSelectedPharmacy(pharmacy)}
                        />
                    ))}

                    {selectedPharmacy && (
                        <InfoWindow
                            position={{ lat: selectedPharmacy.lat, lng: selectedPharmacy.lng }}
                            onCloseClick={() => setSelectedPharmacy(null)}
                        >
                            <div>
                                <h4>{selectedPharmacy.name}</h4>
                                <p>{selectedPharmacy.address}</p>
                                <p>Distance: {selectedPharmacy.distance}</p>
                                <button 
                                    style={styles.button} 
                                    onClick={() => handleSelectPharmacy(selectedPharmacy)}
                                >
                                    Select Pharmacy
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {/* Pharmacy List */}
            <div style={styles.pharmacyList}>
                {pharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} style={styles.pharmacyCard}>
                        <h4>{pharmacy.name}</h4>
                        <p>{pharmacy.address}</p>
                        <p>Distance: {pharmacy.distance}</p>
                        <button 
                            style={styles.selectButton}
                            onClick={() => handleSelectPharmacy(pharmacy)}
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PharmacyMap;

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Times New Roman, serif'
    },
    heading: {
        fontSize: '28px',
        color: '#00796b',
        textAlign: 'center',
        marginBottom: '20px'
    },
    pharmacyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '20px'
    },
    pharmacyCard: {
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
    },
    selectButton: {
        backgroundColor: '#00796b',
        color: '#fff',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px'
    },
    button: {
        backgroundColor: '#00796b',
        color: '#fff',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};
