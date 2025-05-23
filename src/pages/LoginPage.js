import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setSuccessMessage("");

    if (!email || !password || !role) {
      Swal.fire("Error!", "All fields are required", "error");
      return;
    }

    // Admin Login
    if (role === "admin") {
      if (email === "admin" && password === "admin123") {
        sessionStorage.setItem("token", "admin-token");
        sessionStorage.setItem("role", "admin");

        Swal.fire({
          title: "Welcome Admin!",
          text: "Redirecting to Admin Dashboard...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => navigate("/admin"), 2000);
        return;
      } else {
        Swal.fire("Error!", "Invalid admin credentials", "error");
        return;
      }
    }

    // Pharmacist Login (updated)
    if (role === "pharmacist") {
      if (email === "pharmacist" && password === "pharmacist123") {
        sessionStorage.setItem("token", "pharmacist-token");
        sessionStorage.setItem("role", "PHARMACIST");
        sessionStorage.setItem("userName", "Pharmacist");
        sessionStorage.setItem("userId", "pharmacist");

        Swal.fire({
          title: "Welcome Pharmacist!",
          text: "Redirecting to Pharmacy Dashboard...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => navigate("/pharmacy/pharmacy-dashboard"), 2000);
        return;
      } else {
        Swal.fire("Error!", "Invalid pharmacist credentials", "error");
        return;
      }
    }

    // Other roles (doctor, patient, ambulanceStaff)
    try {
      const response = await axios.post("http://localhost:5000/api/auth/user-login", {
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", user.role);
      sessionStorage.setItem("userName", user.name);
      sessionStorage.setItem("userId", user.userId);
      
      if (user.role === "PATIENT") {
        sessionStorage.setItem("patientId", user.id);
      } else if (user.role === "DOCTOR") {
        sessionStorage.setItem("doctorId", user.id);
      }

      Swal.fire({
        title: `Welcome, ${user.name}!`,
        text: "Redirecting to your dashboard...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        if (user.role === "PATIENT") navigate("/patient");
        else if (user.role === "DOCTOR") navigate("/doctor");
        else if (user.role === "AMBULANCESTAFF") navigate("/ambulance-dashboard");
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || "Invalid email or password";
      Swal.fire("Error!", errorMsg, "error");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>MedXpert Login</h1>

          <div style={styles.formGroup}>
            <input
              style={styles.input}
              type="text"
              placeholder={role === "admin" || role === "pharmacist" ? "Username" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <select style={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="ambulanceStaff">Ambulance Staff</option>
            </select>
          </div>

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    height: "100vh",
    width: "100%",
    backgroundImage: `url('https://images.pexels.com/photos/6320167/pexels-photo-6320167.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1000')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "'Times New Roman', serif",
  },
  overlay: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.41)",
    borderRadius: "16px",
    padding: "40px 30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    width: "370px",
    textAlign: "center",
  },
  title: {
    fontSize: "30px",
    color: "#004d4d",
    marginBottom: "25px",
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: "18px",
    textAlign: "left",
  },
  input: {
    height: "45px",
    padding: "10px 12px",
    width: "100%",
    fontSize: "16px",
    fontFamily: "'Times New Roman', serif",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box",
  },
  select: {
    height: "45px",
    padding: "10px 12px",
    width: "100%",
    fontSize: "16px",
    fontFamily: "'Times New Roman', serif",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    fontSize: "18px",
    backgroundColor: "#008080",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    fontFamily: "'Times New Roman', serif",
    transition: "background-color 0.3s ease, transform 0.2s",
    "&:hover": {
      backgroundColor: "#006666",
      transform: "translateY(-2px)",
    },
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default LoginPage;