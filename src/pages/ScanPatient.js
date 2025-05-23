import React from "react";
import BrainIcon from '@mui/icons-material/Psychology';
import XrayIcon from '@mui/icons-material/MedicalServices';
import BloodIcon from '@mui/icons-material/Bloodtype';
import HeartIcon from '@mui/icons-material/Favorite';
import BoneIcon from '@mui/icons-material/AccessibilityNew';
import PetIcon from '@mui/icons-material/Coronavirus';
import EyeIcon from '@mui/icons-material/RemoveRedEye';
import DentalIcon from '@mui/icons-material/MedicalInformation';
import LungsIcon from '@mui/icons-material/AirlineSeatFlat';
import KidneyIcon from '@mui/icons-material/Opacity';

// Sidebar Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScanIcon from '@mui/icons-material/FindInPage';
import AppointmentIcon from '@mui/icons-material/CalendarMonth';
import PrescriptionIcon from '@mui/icons-material/NoteAlt';
import PharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LogoutIcon from '@mui/icons-material/Logout';

const scans = [
  { name: "MRI Brain", price: "₹5,000", icon: <BrainIcon className="icon" /> },
  { name: "CT Chest", price: "₹4,000", icon: <XrayIcon className="icon" /> },
  { name: "X-ray Chest", price: "₹800", icon: <XrayIcon className="icon" /> },
  { name: "Blood Test", price: "₹600", icon: <BloodIcon className="icon" /> },
  { name: "ECG", price: "₹1,000", icon: <HeartIcon className="icon" /> },
  { name: "Bone Density Test", price: "₹3,000", icon: <BoneIcon className="icon" /> },
  { name: "PET Scan", price: "₹15,000", icon: <PetIcon className="icon" /> },
  { name: "Eye Test", price: "₹700", icon: <EyeIcon className="icon" /> },
  { name: "Dental Scan", price: "₹1,500", icon: <DentalIcon className="icon" /> },
  { name: "Lung Test", price: "₹2,000", icon: <LungsIcon className="icon" /> },
  { name: "Kidney Scan", price: "₹4,500", icon: <KidneyIcon className="icon" /> },
];

const ScanPatient = () => {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Times New Roman', Times, serif;
          background-image: url('https://images.pexels.com/photos/7723507/pexels-photo-7723507.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .layout {
          display: flex;
          min-height: 100vh;
          background-color: rgba(255, 255, 255, 0.63);
        }

        .sidebar {
          width: 220px;
          background-color: #044c61;
          padding: 20px;
          color: white;
        }

        .sidebar h2 {
          font-size: 22px;
          margin-bottom: 25px;
        }

        .sidebar a {
          color: white;
          display: flex;
          align-items: center;
          margin: 12px 0;
          text-decoration: none;
          font-size: 17px;
        }

        .sidebar a svg {
          margin-right: 10px;
          font-size: 20px;
        }

        .sidebar a:hover {
          text-decoration: underline;
        }

        .scans-container {
          flex: 1;
          padding: 40px;
        }

        .scans-container h2 {
          text-align: center;
          margin-bottom: 30px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .scan-card {
          background-color: rgba(255, 255, 255, 0.57);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        .scan-card:hover {
          transform: translateY(-5px);
        }

        .icon {
          font-size: 40px;
          color: #044c61;
          margin-bottom: 10px;
        }

        .scan-card h3 {
          margin: 10px 0;
        }

        .scan-card p {
          font-size: 16px;
          color: #333;
        }
      `}</style>

      <div className="layout">
        <div className="sidebar">
          <h2>MedXpert</h2>
          <a href="/patient"><DashboardIcon /> Dashboard</a>
          <a href="/patient/appointment-form"><AppointmentIcon /> Book An Appointment</a>
        </div>

        <div className="scans-container">
          <h2>Available Scans</h2>
          <div className="grid">
            {scans.map((scan, index) => (
              <div key={index} className="scan-card">
                {scan.icon}
                <h3>{scan.name}</h3>
                <p>{scan.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScanPatient;
