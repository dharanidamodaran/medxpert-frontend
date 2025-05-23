// AmbulanceDriverDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AmbulanceDashboard = () => {
  const [dispatchMessage, setDispatchMessage] = useState(null);

  useEffect(() => {
    // Poll the server for dispatch request every 10 seconds
    const interval = setInterval(() => {
      axios.get('http://localhost:5000/api/ambulance/dispatch-status')
        .then(response => {
          if (response.data) {
            setDispatchMessage(`New dispatch request: Patient ID ${response.data.patientId}`);
          }
        })
        .catch(error => {
          console.log('No dispatch request yet', error);
        });
    }, 10000);  // Poll every 10 seconds

    return () => clearInterval(interval);  // Clean up the interval on component unmount
  }, []);

  return (
    <div>
      <h1>Ambulance Driver Dashboard</h1>
      {dispatchMessage ? <p>{dispatchMessage}</p> : <p>No new dispatch request.</p>}
    </div>
  );
};

export default AmbulanceDashboard;
