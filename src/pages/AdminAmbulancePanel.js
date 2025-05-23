import React, { useEffect, useState } from "react";
import { getAllAmbulanceRequests, getPatientVitals } from "./AmbulanceService";

const AdminAmbulancePanel = () => {
  const [requests, setRequests] = useState([]);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    // Fetch ambulance requests
    const fetchRequests = async () => {
      try {
        const data = await getAllAmbulanceRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    // Fetch patient vitals
    const fetchVitals = async () => {
      try {
        const data = await getPatientVitals();
        setVitals(data);
      } catch (error) {
        console.error("Error fetching vitals:", error);
      }
    };

    fetchRequests();
    fetchVitals();
  }, []);

  return (
    <div>
      <h2>🚑 Ambulance Requests</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Patient Name</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.patient.name}</td>
              <td>{req.location}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📊 Patient Vitals</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Heart Rate</th>
            <th>Blood Pressure</th>
            <th>Oxygen Level</th>
            <th>Alert</th>
          </tr>
        </thead>
        <tbody>
          {vitals.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.heartRate} bpm</td>
              <td>{patient.bloodPressure}</td>
              <td>{patient.oxygenLevel}%</td>
              <td>{patient.alert ? "⚠️ Critical" : "✅ Stable"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAmbulancePanel;
