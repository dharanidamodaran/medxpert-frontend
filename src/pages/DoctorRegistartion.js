import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';

const DoctorRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: 1,
    name: '',
    phone: '',
    gender: '',
    dob: '',
    experience: '',
    qualification: '',
    specializationId: '',
  });

  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/get-specializations");
        if (response.status === 200) {
          setSpecializations(response.data);
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();

    // Load from sessionStorage
    const doctorDetails = JSON.parse(sessionStorage.getItem("doctorDetails"));
    const storedUserId = parseInt(sessionStorage.getItem("userId"), 10);

    if (doctorDetails) {
      setFormData(prevData => ({
        ...prevData,
        name: doctorDetails.doctorName || "",
        phone: doctorDetails.phone || "",
        gender: doctorDetails.gender || "",
        dob: doctorDetails.dob || doctorDetails.doctorDetails?.dateofBirth || "",
        experience: doctorDetails.experience || "",
        qualification: doctorDetails.qualification || "",
        specializationId: doctorDetails.doctorDetails?.specialtyId || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "specializationId" ? parseInt(value) : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleSubmit = async (e) => {
    const storedUserId = parseInt(sessionStorage.getItem("userId"), 10);
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/doctors/save-profile/${storedUserId}`, formData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Saved!',
          text: 'Doctor profile has been successfully updated.',
          confirmButtonColor: '#00796b',
        }).then(() => {
          navigate('/doctor');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Unable to save profile. Please try again later.',
          confirmButtonColor: '#00796b',
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong!',
        confirmButtonColor: '#00796b',
      });
    }
  };

  console.log("Submitting formData:", formData);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          <i className="fas fa-user-md" style={{ marginRight: '10px' }}></i>
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Specialization:</label>
            <select
              name="specializationId"
              value={formData.specializationId}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Years of Experience:</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.submitButton}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '15px',
    fontFamily: 'Times New Roman, serif',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    width: '85%',
    maxWidth: '700px',
    boxSizing: 'border-box',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  heading: {
    color: '#00796b',
    fontSize: '28px',
    marginBottom: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    gap: '5px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitButton: {
    backgroundColor: '#00796b',
    color: '#fff',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.2s',
    width: '100%',
    marginTop: '20px',
  }
};
