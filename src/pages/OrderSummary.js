import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ensure medications is initialized as an empty array if no data is passed
  const [medications, setMedications] = useState(location.state?.medications || []);

  useEffect(() => {
    if (location.state && location.state.medications) {
      setMedications(location.state.medications);
    }
  }, [location.state]);

  if (!medications || medications.length === 0) {
    return <div>No medications available for the order.</div>;  // Handle case where no medications are passed
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <div>
        {medications.map((med, index) => (
          <div key={index}>
            <h3>{med.medicineName}</h3>
            <p>Dosage: {med.dosage}</p>
            <p>Duration: {med.duration} days</p>
            <p>Instructions: {med.instructions || 'N/A'}</p>
            <p>Quantity: {med.quantity}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/payment')}>Proceed to Payment</button>
    </div>
  );
};

export default OrderSummary;
