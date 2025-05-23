import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaTachometerAlt, FaClipboardList, FaCheckCircle } from "react-icons/fa";

const PatientDelieverPage = () => {
  const [orders, setOrders] = useState([]);
  const { userId } = useParams(); // Retrieve the userId from the URL params
console.log("User ID from URL params:", userId);

  useEffect(() => {
    // Make API call to fetch delivered orders using the userId
    axios
      .get(`http://localhost:5000/api/patients/orders/delivered/${userId}`)
      .then((response) => {
        console.log("Delivered Orders Response:", response.data);
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (response.data.orders && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      })
      .catch((error) =>
        console.error("Error fetching delivered orders:", error)
      );
  }, [userId]); // Add userId as a dependency to trigger the effect when it changes

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>MedXpert</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/patient" style={styles.link}>
              <FaTachometerAlt style={styles.icon} /> Dashboard
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/patient/patient-order-page" style={styles.link}>
              <FaClipboardList style={styles.icon} /> Orders
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/patient/patient-deliever-page" style={styles.link}>
              <FaCheckCircle style={styles.icon} /> Delivered Orders
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.overlay}></div>
        <h1 style={styles.heading}>Delivered Orders</h1>

        <div style={styles.cardContainer}>
          {orders.length === 0 ? (
            <p style={styles.noData}>No delivered orders found.</p>
          ) : (
            orders.map((order, index) => (
              <div key={index} style={styles.card}>
                <h3 style={styles.cardTitle}>Order ID: {order.orderId}</h3>
                <p>Patient: {order.patientName}</p>
                <p>Medicine: {order.medicineName}</p>
                <p>Quantity: {order.quantity}</p>
                <p>
                  Status:{" "}
                  <span style={{ color: "lightgreen", fontWeight: "bold" }}>
                    {order.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDelieverPage;

// ------------------------------
// ✅ Internal CSS Styles
// ------------------------------
const styles = {
  pageContainer: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Times New Roman', Times, serif",
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#004d4d",
    color: "#fff",
    padding: "20px 15px",
  },
  sidebarTitle: {
    fontSize: "24px",
    marginBottom: "30px",
    fontWeight: "bold",
    textAlign: "center",
  },
  navList: {
    listStyle: "none",
    padding: 0,
  },
  navItem: {
    padding: "12px 10px",
    borderBottom: "1px solid #007a7a",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
  },
  icon: {
    fontSize: "16px",
  },
  content: {
    flex: 1,
    padding: "30px",
    position: "relative",
    backgroundImage:
      "url('https://images.pexels.com/photos/14797855/pexels-photo-14797855.jpeg?auto=compress&cs=tinysrgb&w=1600')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 0,
  },
  heading: {
    position: "relative",
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
    zIndex: 1,
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    position: "relative",
    zIndex: 1,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "250px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    color: "#fff",
    backdropFilter: "blur(5px)",
    fontFamily: "'Times New Roman', Times, serif",
  },
  cardTitle: {
    marginBottom: "10px",
    fontWeight: "bold",
    fontSize: "18px",
  },
  noData: {
    fontSize: "18px",
    fontStyle: "italic",
  },
};
