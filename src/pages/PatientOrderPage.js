import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaClipboardList,
  FaBox,
  FaCheck,
  FaUser,
  FaHome,
  FaPhone,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";

const PatientOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/order/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setOrders(data.data);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #f8fafc;
        }

        .container {
          display: flex;
          min-height: 100vh;
          position: relative;
        }

        .bg-image {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.pexels.com/photos/5650045/pexels-photo-5650045.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.15;
          z-index: -1;
        }

        .sidebar {
          width: 240px;
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
          color: #fff;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: fixed;
          height: 100%;
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .sidebar h2 {
          margin-bottom: 2.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #7dd3fc;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar h2::before {
          content: "💊";
          font-size: 1.2rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          color: #e2e8f0;
        }

        .nav-item:hover {
          background-color: #334155;
          color: #ffffff;
          transform: translateX(3px);
        }

        .nav-item.active {
          background-color: #3b82f6;
          color: #ffffff;
          font-weight: 500;
        }

        .nav-item svg {
          margin-right: 12px;
          font-size: 1rem;
        }

        .main-content {
          flex: 1;
          margin-left: 240px;
          padding: 2rem 3rem;
          background-color: rgba(248, 250, 252, 0.85);
          min-height: 100vh;
          backdrop-filter: blur(2px);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
        }

        .order-count {
          background-color: #3b82f6;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .order-card {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          transition: all 0.2s ease;
          backdrop-filter: blur(2px);
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          background-color: rgba(255, 255, 255, 1);
        }

        .order-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-id {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .order-id span {
          color: #64748b;
          font-weight: 500;
        }

        .order-status {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .status-confirmed {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-dispatched {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .order-body {
          padding: 1.5rem;
        }

        .order-detail {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .order-detail svg {
          margin-right: 0.75rem;
          color: #94a3b8;
          width: 16px;
        }

        .order-detail-value {
          color: #1e293b;
          font-weight: 500;
        }

        .no-orders {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: #64748b;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(2px);
        }

        @media (max-width: 1024px) {
          .orders-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
            padding: 1.5rem 1rem;
          }
          
          .main-content {
            margin-left: 200px;
            padding: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .sidebar {
            width: 100%;
            position: relative;
            height: auto;
          }
          
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
          
          .container {
            flex-direction: column;
          }
          
          .orders-grid {
            grid-template-columns: 1fr;
          }
          
          .bg-image {
            opacity: 0.1;
          }
        }
      `}</style>

      {/* ✅ Background Image - Changed to cosmetic bottles in shopping cart */}
      <div className="bg-image"></div>

      <div className="container">
        <div className="sidebar">
          <h2>MedXpert</h2>
          <div className="nav-item">
            <FaClipboardList />
            <Link to="/patient">Dashboard</Link>
          </div>
          <div className="nav-item active">
            <FaBox />
            <Link to="/patient/patient-order-page">My Orders</Link>
          </div>
          <div className="nav-item">
            <FaCheck />
            <Link to="/patient/patient-deliever-page">Delivered Orders</Link>
          </div>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Active Orders</h1>
            <div className="order-count">{orders.length} orders</div>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">
              <h3>No active orders found</h3>
              <p>You don't have any pending, confirmed, or dispatched orders at the moment.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      Order <span>#{order.orderId}</span>
                    </div>
                    <div className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="order-body">
                    <div className="order-detail">
                      <FaRupeeSign />
                      <span>
                        Amount: <span className="order-detail-value">₹{order.total}</span>
                      </span>
                    </div>
                    <div className="order-detail">
                      <FaUser />
                      <span>
                        Patient:{" "}
                        <span className="order-detail-value">
                          {order.patientName || "Not specified"}
                        </span>
                      </span>
                    </div>
                    <div className="order-detail">
                      <FaPhone />
                      <span>
                        Phone: <span className="order-detail-value">{order.phone}</span>
                      </span>
                    </div>
                    <div className="order-detail">
                      <FaHome />
                      <span>
                        Address: <span className="order-detail-value">{order.address}</span>
                      </span>
                    </div>
                    <div className="order-detail">
                      <FaCalendarAlt />
                      <span>
                        Placed:{" "}
                        <span className="order-detail-value">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientOrdersPage;