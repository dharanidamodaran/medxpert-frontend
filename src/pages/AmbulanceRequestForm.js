import React, { useState } from "react";
import { requestAmbulance } from "./AmbulanceService";

const AmbulanceRequestForm = () => {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const handleRequest = async () => {
    try {
      const response = await requestAmbulance({ location });
      setStatus(`✅ Request Sent! Status: ${response.status}`);
    } catch (error) {
      console.error("Error requesting ambulance:", error);
      setStatus("❌ Error sending request!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🚑 Request an Ambulance</h2>
      <input
        type="text"
        placeholder="Enter your location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleRequest} style={styles.button}>Send Request</button>
      {status && <p style={styles.statusMessage}>{status}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: "50%",
    margin: "50px auto",
    textAlign: "center",
    padding: "20px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa",
  },
  heading: {
    color: "#d9534f",
  },
  input: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#d9534f",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  statusMessage: {
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default AmbulanceRequestForm;
