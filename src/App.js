import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './components/Home';  // ✅ Homepage first
import './App.css';
import AdminDashboard from './components/AdminDashboard'; 
import RegisterUser from './pages/RegisterUser';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard'; 
import DoctorRegistration from './pages/DoctorRegistartion'; 
import PatientRegistration from './pages/PatientRegistration';
import AppointmentForm from './pages/AppointmentForm';
import PrescriptionForm from './pages/PrescriptionForm';
import AdminPrescriptions from './pages/AdminPrescriptions';
import DoctorPrescriptionView from './pages/DoctorPrescriptionView';
import PatientPrescription from './pages/PatientPrescription';
import CartPage from './pages/CartPage';
import PharmacySelectionPage from './pages/PharmacySelectionPage';
import StaffRegistration from './pages/GenralRegister';
import AdminAppointments from './pages/AdminAppointments';
import AmbulanceMonitoring from './pages/AmbulanceMonitoring';
import ScansPage from './pages/ScanPatient';
import PharmacyMap from './components/PharmacyMap';  // Import the map component
// import CommunicationPage from './pages/CommunicationPage';
import PatientAppointments from './pages/ViewPatientAppointment';
import DoctorPatientView from './pages/DoctorPatientView';
import DoctorAppointmentViewing from './pages/DoctorAppointmentViewing';
import LiveChat from './pages/LiveChat';
import VideoAudioChat from './pages/VideoAudioChat';
import PharmacyDashboard from './pages/PharmacyDashboard';
import PendingOrders from './pages/PendingOrders';
import ConfirmedOrders from './pages/ConfirmedOrders';
import DispatchedOrders from './pages/DispatchedOrders';
import DeliveredOrders from './pages/DelieveredOrders';
import UpdateMedicine from './pages/UpdateMedicine';
import DeliveredPage from './pages/DeliveredPage';
import PendingAppointments from './pages/PendingAppointments';
import DoctorChat from './pages/DoctorChat';
import BuyMedicine from './pages/BuyMedicine';
import AddMedicineForm from './pages/AddMedicineForm';
import DoctorAppointmentDetails from './pages/DoctorAppointmentDetails';
import AdminDoctorList from './pages/AdminDoctorList';
import AdminPatientList from './pages/AdminPatientList';
import OrderSummary from './pages/OrderSummary';
//import ambulanceMonitoring from './pages/AmbulanceMonitoring';
import AmbulanceDashboard from './components/AmbulanceDashboard';
import PatientOrderPage from './pages/PatientOrderPage'
import PatientDelieverPage from './pages/PatientDelieverPage';
//import PatientMonitoring from './pages/PatientMonitoring';
// import AmbulanceList from './pages/AmbulanceList';




const App = () => {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />  {/* ✅ Homepage first */}
                    <Route path="/login" element={<LoginPage />} />  {/* ✅ Navigate to login */}
                    <Route path="/home" element={<HomePage />} />  {/* ✅ After login */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/doctor" element={<DoctorDashboard />} />
                    <Route path="/patient" element={<PatientDashboard />} />
                    <Route path="/doctor/doctor-registration" element={<DoctorRegistration />} />
                    <Route path="/patient/patient-registration" element={<PatientRegistration />} />
                    <Route path="/patient/appointment-form" element={<AppointmentForm />} />
                    <Route path="/admin/register-user" element={<RegisterUser />} />
                    <Route path="/doctor/prescription-form/:appointmentId" element={<PrescriptionForm />} />
                    <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
                    <Route path="/doctor/prescription-view" element={<DoctorPrescriptionView />} />
                    <Route path="/patient/patient-prescription" element={<PatientPrescription />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/pharmacy-selection" element={<PharmacySelectionPage />} />
                    <Route path="/staff-registration" element={<StaffRegistration />} />
                    <Route path="/admin/appointments" element={<AdminAppointments />} />
                    <Route path="/pharmacy-map" element={<PharmacyMap />} />
                    <Route path="/admin/ambulance-monitoring" element={<AmbulanceMonitoring />} />
                    <Route path="/patient/scan-patient" element={<ScansPage />} />
                    {/* <Route path="/patient/communication" element={<CommunicationPage />} /> */}
                    <Route path="/patient/appointments" element={<PatientAppointments />} />
                    <Route path="/doctor/patient-view" element={<DoctorPatientView />} />
                    <Route path="/doctor/appointment-viewing" element={<DoctorAppointmentViewing />} />
                    <Route path="/live-chat" element={<LiveChat />} />
                    <Route path="/video-audio-chat" element={<VideoAudioChat />} />
                    <Route path="/pharmacy/pharmacy-dashboard" element={<PharmacyDashboard />} />
                    <Route path="/pharmacy/pending-orders" element={<PendingOrders />} />
                    <Route path="/pharmacy/confirmed-orders" element={<ConfirmedOrders />} />
                    <Route path="/pharmacy/dispatched-orders" element={<DispatchedOrders />} />
                    <Route path="/pharmacy/delivered-orders" element={<DeliveredOrders />} />
                    <Route path="/pharmacy/update-medicine" element={<UpdateMedicine />} />
                    <Route path="/pharmacy/delivered-page" element={<DeliveredPage />} />
                    <Route path="/admin/pending-appointments" element={<PendingAppointments />} />
                    <Route path="/doctor/doctor-chat" element={<DoctorChat />} />
                    <Route path="/patient/buy-medicine" element={<BuyMedicine />} />
                    <Route path="/pharmacy/add-medicine-form" element={<AddMedicineForm />} />
                    <Route path="/doctor/doctor-appointment-details" element={<DoctorAppointmentDetails />} />
                    <Route path="/doctor/doctor-appointment-viewing" element={<DoctorAppointmentViewing />} />  
                    <Route path="/admin/admin-doctor-list" element={<AdminDoctorList />} />
                    <Route path="/admin/admin-patient-list" element={<AdminPatientList />} />
                    <Route path="/patient/order-summary" element={<OrderSummary />} />
                    <Route path="/ambulance-dashboard" element={<AmbulanceDashboard />} /> 
                    <Route path="/ambulance-monitoring" element={<ambulanceMonitoring />} />
                    <Route path="/patient/patient-order-page" element={<PatientOrderPage />} />
                    <Route path="/patient/patient-deliever-page" element={<PatientDelieverPage />} />
                    
                    {/* <Route path="/patient-monitoring" element={<PatientMonitoring />} /> */}
                    {/* <Route path="/ambulance/ambulance-booking" element={<AmbulanceBooking />} />
                    <Route path="/ambulance/ambulance-list" element={<AmbulanceList />} /> */}
                    

                    
                    <Route path="*" element={<Navigate to="/" />} />



                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
