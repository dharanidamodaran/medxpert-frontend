import React from 'react';
import ReactDOM from 'react-dom/client';   // ✅ Use createRoot in React 18
import App from './App';
import './index.css';
import { ToastContainer } from 'react-toastify';
// import AdminAppointments from './pages/AdminAppointments';

// 🔥 New React 18 render syntax
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <App />
  </React.StrictMode>
  
);
