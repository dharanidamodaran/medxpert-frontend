import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/ambulance"; // Adjust as per your backend

// 🟢 Fetch all ambulance requests (for Admin & Drivers)
export const getAllAmbulanceRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ambulance requests:", error);
    throw error;
  }
};

// 🟢 Update ambulance request status (For Drivers)
export const updateAmbulanceStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/requests/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

// 🟢 Fetch patient vitals (For Admin to monitor)
export const getPatientVitals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/patient-vitals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient vitals:", error);
    throw error;
  }
};

// 🟢 Request an ambulance (For Patients)
export const requestAmbulance = async (patientId, location) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/request`, { patientId, location });
    return response.data;
  } catch (error) {
    console.error("Error requesting ambulance:", error);
    throw error;
  }
};
