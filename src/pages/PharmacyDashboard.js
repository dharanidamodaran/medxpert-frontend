import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPills, FaClipboardList, FaSignOutAlt, FaCapsules, FaCheckCircle, FaTruck, FaBox } from "react-icons/fa";

const PharmacyDashboard = () => {
  const navigate = useNavigate();

  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false); // State to toggle dropdown visibility
  const [pendingOrders, setPendingOrders] = useState(0);
  const [confirmedOrders, setConfirmedOrders] = useState(0);
  const [dispatchedOrders, setDispatchedOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);

  const handleLogout = () => {
    navigate("/login");
  };

  // Fetch the order counts from the APIs
  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        const pendingResponse = await fetch("http://localhost:5000/api/order/pending-count");
        const confirmedResponse = await fetch("http://localhost:5000/api/order/confirmed-count");
        const dispatchedResponse = await fetch("http://localhost:5000/api/order/dispatched-count");
        const deliveredResponse = await fetch("http://localhost:5000/api/order/delivered-count");

        const pendingData = await pendingResponse.json();
        const confirmedData = await confirmedResponse.json();
        const dispatchedData = await dispatchedResponse.json();
        const deliveredData = await deliveredResponse.json();

        setPendingOrders(pendingData.pendingOrderCount);
        setConfirmedOrders(confirmedData.confirmedOrderCount);
        setDispatchedOrders(dispatchedData.dispatchedOrderCount);
        setDeliveredOrders(deliveredData.deliveredOrderCount);
      } catch (error) {
        console.error("Error fetching order counts:", error);
      }
    };

    fetchOrderCounts();
  }, []);

  return (
    <>
      <style>{`
        * {
          font-family: 'Times New Roman', serif;
        }

        a {
          text-decoration: none;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background-image: url('https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .sidebar {
          width: 250px;
          background-color: rgba(0, 128, 128, 0.95);
          color: white;
          padding: 20px;
          position: fixed;
          height: 100vh;
        }

        .sidebar h2 {
          font-size: 24px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          color: white;
          font-size: 18px;
          margin-bottom: 10px;
          transition: 0.3s;
        }

        .nav-item:hover {
          background-color: #006666;
          border-radius: 5px;
        }

        .logout-btn {
          border: none;
          color: white;
          padding: 10px;
          font-size: 18px;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 20px;
          width: 100%;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logout-btn:hover {
          background-color: #C9302C;
        }

        .dashboard {
          margin-left: 270px;
          padding: 20px;
          flex: 1;
        }

        .dashboard h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #fff;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .order-card {
          width: 250px; /* Reduced width */
          height: 140px; /* Optional: Set height to make them more uniform */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border-radius: 10px;
          text-decoration: none;
          color: white;
          font-size: 18px;
          font-weight: bold;
          transition: 0.3s;
          background-color: rgba(0, 0, 0, 0.6);
        }

        .order-card:hover {
          transform: translateY(-5px);
          opacity: 0.9;
        }

        .order-card h3 {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .order-card p {
          margin: 0;
        }

        .dropdown-list {
          list-style: none;
          padding-left: 20px;
          margin: 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          font-size: 18px;
          color: white;
          transition: 0.3s;
        }

        .dropdown-item:hover {
          background-color: #006666;
          border-radius: 5px;
        }
      `}</style>

      <div className="dashboard-container">
        <div className="sidebar">
          <h2><FaCapsules /> Pharmacy</h2>
          <nav>
            <Link to="/pharmacy/add-medicine-form" className="nav-item">
              <FaPills /> Add Medicine
            </Link>
            <div className="nav-item" onClick={() => setShowOrdersDropdown(!showOrdersDropdown)}>
              <FaClipboardList /> Orders
            </div>

            {/* Dropdown Menu */}
            {showOrdersDropdown && (
              <ul className="dropdown-list">
                <Link to="/pharmacy/confirmed-orders" className="dropdown-item">
                  <FaCheckCircle /> Confirmed Orders
                </Link>
                <Link to="/pharmacy/dispatched-orders" className="dropdown-item">
                  <FaTruck /> Dispatched Orders
                </Link>
                <Link to="/pharmacy/delivered-orders" className="dropdown-item">
                  <FaBox /> Delivered Orders
                </Link>
              </ul>
            )}

            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>

        <div className="dashboard">
          <h2>Pharmacy Dashboard</h2>
          <div className="cards-container">
            <Link to="/pharmacy/pending-orders" className="order-card" style={{ backgroundColor: "#FFC107" }}>
              <h3>{pendingOrders}</h3>
              <p>Pending Orders</p>
            </Link>
            <Link to="/pharmacy/confirmed-orders" className="order-card" style={{ backgroundColor: "#28A745" }}>
              <h3>{confirmedOrders}</h3>
              <p>Confirmed Orders</p>
            </Link>
            <Link to="/pharmacy/dispatched-orders" className="order-card" style={{ backgroundColor: "#007BFF" }}>
              <h3>{dispatchedOrders}</h3>
              <p>Dispatched Orders</p>
            </Link>
            <Link to="/pharmacy/delivered-orders" className="order-card" style={{ backgroundColor: "#6C757D" }}>
              <h3>{deliveredOrders}</h3>
              <p>Delivered Orders</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyDashboard;
