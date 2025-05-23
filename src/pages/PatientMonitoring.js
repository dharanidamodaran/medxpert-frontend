import React, { useEffect, useState } from "react";
import { fetchMonitoredPatients, triggerAmbulance } from "./AmbulanceService";
import "./PatientMonitoring.css";

const PatientMonitoring = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await fetchMonitoredPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatients();

    const interval = setInterval(fetchPatients, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleAlertAmbulance = async (patientId) => {
    try {
      await triggerAmbulance(patientId);
      alert(`🚑 Ambulance dispatched for patient ID: ${patientId}`);
    } catch (error) {
      console.error("Error dispatching ambulance:", error);
    }
  };

  return (
    <div className="monitor-container">
      <h2>🩺 Patient Monitoring Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Heart Rate</th>
            <th>Blood Pressure</th>
            <th>Oxygen Level</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className={patient.critical ? "critical" : ""}>
              <td>{patient.name}</td>
              <td>{patient.heartRate} bpm</td>
              <td>{patient.bloodPressure}</td>
              <td>{patient.oxygenLevel}%</td>
              <td>{patient.critical ? "⚠️ Critical" : "Stable"}</td>
              <td>
                {patient.critical && (
                  <button className="alert-button" onClick={() => handleAlertAmbulance(patient.id)}>
                    🚨 Alert Ambulance
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientMonitoring;
