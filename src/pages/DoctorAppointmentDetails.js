import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBars, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DoctorAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const doctorId = JSON.parse(sessionStorage.getItem('doctorId'));

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/get-appointments/${doctorId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCardClick = (appointment) => {
    navigate(`/doctor/appointment/${appointment.id}`, { state: { appointment } });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-[Times_New_Roman]">
      {/* Sidebar */}
      <div className="w-1/5 bg-teal-700 text-white p-4 hidden md:block">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FaBars /> Menu</h3>
        <ul className="space-y-4">
          <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
          <li className="font-semibold underline">Appointments</li>
          <li className="hover:text-gray-300 cursor-pointer">Patients</li>
          <li className="hover:text-gray-300 cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6 text-teal-700 flex items-center gap-2"><FaCalendarAlt /> Doctor Appointments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-4 shadow rounded-lg cursor-pointer hover:shadow-md transition"
              onClick={() => handleCardClick(appt)}
            >
              <h3 className="text-lg font-semibold mb-2">{appt.patient}</h3>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p className={`mt-1 font-semibold ${appt.status === 'Pending' ? 'text-yellow-600' : appt.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
                {appt.status}
              </p>
              <div className="mt-3 text-right text-sm text-teal-600 flex items-center justify-end gap-1">
                <FaEye /> View Details
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentList;
