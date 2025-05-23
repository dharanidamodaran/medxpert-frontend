import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserMd, FaUser, FaComments, FaSignOutAlt } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/chat"; // Update API URL

const DoctorChat = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const storedDoctorId = sessionStorage.getItem("doctorId");
    const doctorId = storedDoctorId ? Number(storedDoctorId) : null;
    console.log("🔹 Doctor ID after retrieval:", doctorId);




    // Fetch assigned patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/patients`);
                setPatients(response.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        if (doctorId) {
            fetchPatients();
        }
    }, [doctorId]);

    // Fetch chat messages
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const doctorId = 1; // Replace with actual doctorId from auth
                const response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/patients`);
                console.log("📄 Patients Data:", response.data); // Debugging
                setPatients(response.data);
            } catch (error) {
                console.error("❌ Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);


    // Handle sending messages
    const sendMessage = async () => {
        console.log("📢 Trying to send message...");
        console.log("🔹 Doctor ID:", doctorId);
        console.log("🔹 Selected Patient:", selectedPatient);
        console.log("🔹 Message Content:", newMessage);

        if (!doctorId || !selectedPatient || !newMessage.trim()) {
            console.error("❌ Missing required fields for sending message.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/send`, {
                senderId: doctorId,
                receiverId: selectedPatient.id,
                content: newMessage,
                conversationId: `${doctorId}_${selectedPatient.id}`,
            });

            setMessages([...messages, response.data.message]);
            setNewMessage("");
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };



    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <nav style={styles.sidebar}>
                <h2>MedXpert</h2>
                <ul style={styles.navList}>
                    <li style={styles.navItem} onClick={() => navigate("/doctor")}>
                        <FaUserMd /> Dashboard
                    </li>
                    <li style={styles.navItem} onClick={() => navigate("/doctor-patients")}>
                        <FaUser /> Patients
                    </li>
                    <li style={{ ...styles.navItem, ...styles.active }}>
                        <FaComments /> Chat
                    </li>
                    <li style={styles.navItem} onClick={() => navigate("/logout")}>
                        <FaSignOutAlt /> Logout
                    </li>
                </ul>
            </nav>

            {/* Main Chat Section */}
            <div style={styles.chatSection}>
                {/* Patient List */}
                {/* Patient List Sidebar */}
                <div style={styles.chatSidebar}>
                    <h3>Patients</h3>
                    <ul style={styles.patientList}>
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <li
                                    key={patient.id}
                                    style={selectedPatient?.id === patient.id ? styles.activePatient : styles.patientItem}
                                    onClick={() => setSelectedPatient(patient)}
                                >
                                    {patient.name}
                                </li>
                            ))
                        ) : (
                            <p>No assigned patients.</p>
                        )}
                    </ul>
                </div>


                {/* Chat Window */}
                <div style={styles.chatWindow}>
                    {selectedPatient ? (
                        <>
                            <div style={styles.chatHeader}>
                                <h3>Chat with {selectedPatient.name}</h3>
                            </div>

                            <div style={styles.chatMessages}>
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            style={msg.senderId === doctorId ? styles.sentMessage : styles.receivedMessage}
                                        >
                                            {msg.content}
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages yet.</p>
                                )}
                            </div>

                            <div style={styles.chatInput}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={styles.inputField}
                                />
                                <button onClick={sendMessage} style={styles.sendButton}>
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <p style={styles.noChatSelected}>Select a patient to start chatting.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "100vh",
    },
    sidebar: {
        width: "250px",
        background: "#008080",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
    },
    navList: {
        listStyle: "none",
        padding: 0,
    },
    navItem: {
        padding: "15px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    active: {
        background: "#006666",
    },
    chatSection: {
        display: "flex",
        flex: 1,
    },
    chatSidebar: {
        width: "250px",
        background: "#f4f4f4",
        padding: "20px",
    },
    patientList: {
        listStyle: "none",
        padding: 0,
    },
    patientItem: {
        padding: "10px",
        cursor: "pointer",
        borderBottom: "1px solid #ddd",
    },
    activePatient: {
        background: "#ddd",
        padding: "10px",
        cursor: "pointer",
    },
    chatWindow: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
    },
    chatHeader: {
        background: "#008080",
        color: "white",
        padding: "10px",
    },
    chatMessages: {
        flex: 1,
        padding: "10px",
        overflowY: "auto",
        border: "1px solid #ddd",
    },
    sentMessage: {
        padding: "10px",
        margin: "5px",
        borderRadius: "5px",
        maxWidth: "70%",
        background: "#008080",
        color: "white",
        alignSelf: "flex-end",
    },
    receivedMessage: {
        padding: "10px",
        margin: "5px",
        borderRadius: "5px",
        maxWidth: "70%",
        background: "#eee",
        color: "black",
        alignSelf: "flex-start",
    },
    chatInput: {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #ddd",
    },
    inputField: {
        flex: 1,
        padding: "10px",
        border: "1px solid #ddd",
    },
    sendButton: {
        background: "#008080",
        color: "white",
        padding: "10px 20px",
        border: "none",
        cursor: "pointer",
    },
    noChatSelected: {
        textAlign: "center",
        fontSize: "18px",
        color: "#555",
    },
};

export default DoctorChat;
