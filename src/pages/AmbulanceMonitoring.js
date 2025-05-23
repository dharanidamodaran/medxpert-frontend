import React, { useState, useEffect } from 'react';
import { FaAmbulance, FaHeartbeat, FaExclamationTriangle, FaHome, FaListAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Coimbatore location bounds
const COIMBATORE_LAT_MIN = 10.99;
const COIMBATORE_LAT_MAX = 11.11;
const COIMBATORE_LNG_MIN = 76.91;
const COIMBATORE_LNG_MAX = 77.15;

// Styled components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarLogo = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    color: #ecf0f1;
    margin: 0;
    font-size: 1.5rem;
    text-align: center;
  }
`;

const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 20px 0;
    margin: 0;
    
    li {
      padding: 12px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      
      &:hover {
        background-color: #34495e;
      }
      
      svg {
        margin-right: 10px;
        font-size: 1.1rem;
      }
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
`;

const Header = styled.header`
  h1 {
    color: #2c3e50;
    margin: 0 0 20px;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
  }
`;

const PatientsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const PatientCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: ${props => props.critical ? '4px solid #e74c3c' : '4px solid #2ecc71'};
  animation: ${props => props.critical ? 'pulse 2s infinite' : 'none'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    margin: 0 0 15px;
    color: #2c3e50;
    font-size: 1.2rem;
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;
`;

const StatCard = styled.div`
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: ${props => props.critical ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.critical ? '#c62828' : '#2e7d32'};
  
  p {
    margin: 0 0 5px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  h2 {
    margin: 0;
    font-size: 1.4rem;
  }
  
  svg {
    font-size: 1.8rem;
    margin-bottom: 8px;
    color: inherit;
  }
`;

const StatusCard = styled.div`
  padding: 12px;
  border-radius: 6px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.alert ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.alert ? '#c62828' : '#2e7d32'};
  
  p {
    margin: 0;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  
  svg {
    margin-right: 8px;
    font-size: 1.2rem;
  }
`;

const MapContainerStyled = styled.div`
  margin: 15px 0;
  height: 200px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin: 0 0 10px;
    font-size: 1.1rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    
    &::before {
      content: '📍';
      margin-right: 8px;
    }
  }
  
  .leaflet-container {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  
  .leaflet-control-attribution {
    font-size: 9px;
    background: rgba(255, 255, 255, 0.8);
    padding: 2px 5px;
  }
  
  .leaflet-popup-content {
    margin: 10px;
    font-size: 14px;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 4px;
  }
`;

const DispatchContainer = styled.div`
  margin-top: 15px;
`;

const DispatchButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #c0392b;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const AmbulanceMonitoring = () => {
  const [patients, setPatients] = useState([]);

  // Function to generate a random patient within Coimbatore's bounds
  const generatePatient = () => ({
    id: Math.random().toString(36).substring(2, 9),
    bp: Math.floor(Math.random() * (130 - 90) + 90),
    pulse: Math.floor(Math.random() * (100 - 60) + 60),
    heartRate: Math.floor(Math.random() * (110 - 70) + 70),
    status: 'Normal ✅',
    alert: false,
    location: {
      lat: parseFloat((Math.random() * (COIMBATORE_LAT_MAX - COIMBATORE_LAT_MIN) + COIMBATORE_LAT_MIN).toFixed(4)),
      lng: parseFloat((Math.random() * (COIMBATORE_LNG_MAX - COIMBATORE_LNG_MIN) + COIMBATORE_LNG_MIN).toFixed(4)),
    },
  });

  // Generate initial list of 5 patients
  useEffect(() => {
    const initialPatients = Array.from({ length: 5 }, generatePatient);
    setPatients(initialPatients);

    const interval = setInterval(() => {
      setPatients((prevPatients) =>
        prevPatients.map((patient) => {
          const newBP = Math.floor(Math.random() * (130 - 90) + 90);
          const newPulse = Math.floor(Math.random() * (100 - 60) + 60);
          const newHeartRate = Math.floor(Math.random() * (110 - 70) + 70);
          let newStatus = 'Normal ✅';
          let alert = false;

          // Check vitals
          if (newBP < 90 || newPulse < 60 || newHeartRate < 70) {
            newStatus = 'Critical 🚨';
            alert = true;
          } else if (newBP < 100 || newPulse < 70 || newHeartRate < 75) {
            newStatus = 'Warning ⚠️';
            alert = true;
          }

          return {
            ...patient,
            bp: newBP,
            pulse: newPulse,
            heartRate: newHeartRate,
            status: newStatus,
            alert,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDispatch = async (patientId) => {
    const response = await fetch('http://localhost:5000/api/ambulance/dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message);
    }
  };

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <Sidebar>
        <SidebarLogo>
          <h2>MedXpert</h2>
        </SidebarLogo>
        <SidebarNav>
          <ul>
            <li><FaHome /> Home</li>
            <li><FaListAlt /> Patient List</li>
            <li><FaAmbulance /> Ambulance Monitoring</li>
          </ul>
        </SidebarNav>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <Header>
          <h1>🩺 Real-Time Patient Monitoring</h1>
        </Header>

        <PatientsContainer>
          {patients.map((patient) => (
            <PatientCard key={patient.id} critical={patient.alert}>
              <h3>Patient ID: {patient.id}</h3>

              <StatsContainer>
                <StatCard critical={patient.alert && patient.bp < 90}>
                  <FaHeartbeat />
                  <p>Blood Pressure</p>
                  <h2>{patient.bp} mmHg</h2>
                </StatCard>

                <StatCard critical={patient.alert && patient.pulse < 60}>
                  <FaHeartbeat />
                  <p>Pulse Rate</p>
                  <h2>{patient.pulse} bpm</h2>
                </StatCard>

                <StatCard critical={patient.alert && patient.heartRate < 70}>
                  <FaHeartbeat />
                  <p>Heart Rate</p>
                  <h2>{patient.heartRate} bpm</h2>
                </StatCard>
              </StatsContainer>

              <StatusCard alert={patient.alert}>
                <FaExclamationTriangle />
                <p>Status: {patient.status}</p>
              </StatusCard>

              {/* Map showing patient's location */}
              <MapContainerStyled>
                <h2>Patient's Location</h2>
                <MapContainer
                  center={[patient.location.lat, patient.location.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  maxBounds={[
                    [COIMBATORE_LAT_MIN, COIMBATORE_LNG_MIN],
                    [COIMBATORE_LAT_MAX, COIMBATORE_LNG_MAX],
                  ]}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[patient.location.lat, patient.location.lng]}>
                    <Popup>
                      Patient Location <br />
                      {patient.location.lat}, {patient.location.lng}
                    </Popup>
                  </Marker>
                </MapContainer>
              </MapContainerStyled>

              {/* Dispatch button */}
              {patient.alert && (
                <DispatchContainer>
                  <DispatchButton onClick={() => handleDispatch(patient.id)}>
                    <FaAmbulance /> Dispatch Ambulance
                  </DispatchButton>
                </DispatchContainer>
              )}
            </PatientCard>
          ))}
        </PatientsContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default AmbulanceMonitoring;