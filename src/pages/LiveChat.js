import React, { useEffect, useState } from "react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [requestedDoctorId, setRequestedDoctorId] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors/get-doctors", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctors");
        return res.json();
      })
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleChatRequest = (doctorId) => {
    const patientId = sessionStorage.getItem("userId");
    console.log("patientId:", patientId);
    console.log("doctorId:", doctorId);
  
    if (!patientId || !doctorId) {
      console.error("Missing patientId or doctorId");
      alert("Cannot send chat request. Missing required information.");
      return;
    }
  
    fetch("http://localhost:5000/api/chat/chat-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ patientId, doctorId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Chat request failed");
        return res.json();
      })
      .then(() => {
        setRequestedDoctorId(doctorId);
        alert("Chat request sent!");
      })
      .catch((err) => {
        console.error("Chat request error:", err);
        alert("Failed to send chat request");
      });
  };
  
  
  const styles = {
    page: {
      display: "flex",
      fontFamily: "'Times New Roman', serif",
      backgroundColor: "#f0f4f8",
      height: "100vh",
      margin: 0,
    },
    sidebar: {
      width: "220px",
      backgroundColor: "teal",
      color: "white",
      padding: "20px",
    },
    sidebarTitle: {
      fontSize: "24px",
      marginBottom: "20px",
    },
    sidebarList: {
      listStyle: "none",
      paddingLeft: 0,
    },
    sidebarItem: {
      marginBottom: "15px",
      cursor: "pointer",
    },
    content: {
      flex: 1,
      padding: "30px",
      backgroundColor: "#f9fafa",
      overflowY: "auto",
    },
    title: {
      fontSize: "28px",
      marginBottom: "20px",
      color: "#333",
    },
    doctorList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
    },
    doctorCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      width: "260px",
      transition: "transform 0.2s ease-in-out",
    },
    doctorCardHover: {
      transform: "translateY(-5px)",
    },
    doctorName: {
      margin: "0 0 10px",
      color: "#006d6d",
    },
    doctorDetail: {
      margin: "6px 0",
      color: "#555",
    },
    chatButton: {
      marginTop: "10px",
      backgroundColor: "teal",
      color: "white",
      padding: "8px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    chatButtonDisabled: {
      marginTop: "10px",
      backgroundColor: "#ccc",
      color: "#666",
      padding: "8px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>MedXpert</h2>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItem}>Dashboard</li>
          <li style={styles.sidebarItem}>Doctors</li>
          <li style={styles.sidebarItem}>Appointments</li>
          <li style={styles.sidebarItem}>Patients</li>
        </ul>
      </div>
      <div style={styles.content}>
        <h1 style={styles.title}>Available Doctors</h1>
        <div style={styles.doctorList}>
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              style={styles.doctorCard}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h2>Dr. {doctor.name || "Unknown"}</h2>
              <p style={styles.doctorDetail}>
                <strong>Specialty:</strong> {doctor.specialty?.name || "General"}
              </p>
              <p style={styles.doctorDetail}>
                <strong>Experience:</strong> {doctor.experience || "N/A"} years
              </p>
              <p style={styles.doctorDetail}>
                <strong>Phone:</strong> {doctor.phone || "N/A"}
              </p>
              <button
                style={
                  requestedDoctorId === doctor.id
                    ? styles.chatButtonDisabled
                    : styles.chatButton
                }
                disabled={requestedDoctorId === doctor.id}
                onClick={() => handleChatRequest(doctor.id)}
              >
                {requestedDoctorId === doctor.id ? "Requested" : "Request Chat"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
