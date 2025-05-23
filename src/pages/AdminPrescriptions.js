import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPrescriptions.css";
import {
  FaSearch,
  FaSort,
  FaFilePrescription,
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaNotesMedical,
} from "react-icons/fa";
import { MdDashboard, MdEvent, MdSettings, MdAssessment, MdLogout } from "react-icons/md";
import { FaUserMd, FaUserInjured } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/ehr";

const AdminPrescriptions = () => {
  const navigate = useNavigate();
  const [ehrRecords, setEhrRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Fetch EHR records from API
  useEffect(() => {
    const fetchEHRRecords = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          console.error("❌ No token found! Please log in again.");
          return;
        }

        console.log("🛡️ Token Retrieved:", token); // Debugging

        const response = await axios.get(`http://localhost:5000/api/ehr/get-ehr`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("📄 Fetched Data:", response.data);
        // Update to handle the nested data structure
        setEhrRecords(response.data.data || []);
      } catch (error) {
        console.error("❌ Error fetching EHR records:", error.response ? error.response.data : error.message);
      }
    };

    fetchEHRRecords();
  }, []);

  // Search Filter
  const filteredRecords = ehrRecords.filter(
    (record) =>
      (record.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle PDF Download
  const downloadEHR = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/download-ehr/${id}/pdf`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `EHR_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading EHR:", error);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format medications for display
  const formatMedications = (medications) => {
    if (!medications || !Array.isArray(medications)) return "N/A";
    
    return medications.map(med => 
      `${med.medicineName} (${med.dosage}mg, ${med.times}x/day, ${med.duration} days)`
    ).join(", ");
  };

  return (
    <div className="admin-prescription-container">
      <div className="admin-nav">
        <div className="admin-nav-heading">Medical History</div>
        <ul>
          <li><MdDashboard /> <a href="/admin">Dashboard</a></li>
          <li><MdEvent /> <a href="/admin/appointments">Appointments</a></li>
          <li><FaUserMd /> <a href="/admin/admin-doctor-list">Doctors</a></li>
          <li><FaUserInjured /> <a href="/admin/admin-patient-list">Patients</a></li>
        </ul>
      </div>
    
      {/* Page Content */}
      <div className="content">
        <h2 className="title">
          <FaFilePrescription /> Medical History
        </h2>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by patient or doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* EHR Records Table */}
        <table className="prescription-table">
          <thead>
            <tr>
              <th>ID <FaSort /></th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Prescription</th>
              <th>Visit Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.patient?.name || "N/A"}</td>
                  <td>{calculateAge(record.patient?.dateofBirth)}</td>
                  <td>{record.patient?.gender || "N/A"}</td>
                  <td>{record.doctor?.name || "N/A"}</td>
                  <td>{record.doctor?.qualification || "N/A"}</td>
                  <td>{record.diagnosis || "N/A"}</td>
                  <td>{record.treatment || "N/A"}</td>
                  <td>{formatMedications(record.medications)}</td>
                  <td>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button 
                      className="download-btn"
                      onClick={() => downloadEHR(record.id)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No records found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredRecords.length > recordsPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredRecords.length / recordsPerPage) }, (_, i) => (
              <button 
                key={i} 
                onClick={() => paginate(i + 1)} 
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPrescriptions;