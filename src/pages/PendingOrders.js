import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PendingOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order/orders/pending");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      await axios.patch(`http://localhost:5000/api/order/orders/${orderId}/confirm`);
      Swal.fire("Confirmed!", "Order has been confirmed.", "success");
      fetchPendingOrders();
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`http://localhost:5000/api/order/order/cancel/${orderId}`);
        Swal.fire("Cancelled!", "Order has been cancelled.", "success");
        fetchPendingOrders();
      } catch (error) {
        Swal.fire("Error!", "Could not cancel the order.", "error");
      }
    }
  };

  return (
    <>
      <style>{`
        .orders-container {
          margin: 20px auto;
          max-width: 800px;
          font-family: "Times New Roman", Times, serif;
        }

        .order-card {
  font-family: "Times New Roman", Times, serif;
  background-color: rgba(255, 255, 255, 0.54);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
}

        .order-card h3 {
          margin-bottom: 10px;
        }

        .order-btns {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .confirm-btn {
          background: #28A745;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .cancel-btn {
          background: #DC3545;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
        }

        .dashboard-btn {
          background: #007BFF;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 20px;
          font-family: "Times New Roman", Times, serif;
        }

        .confirm-btn:hover { background: #218838; }
        .cancel-btn:hover { background: #C82333; }
        .dashboard-btn:hover { background: #0056b3; }
      `}</style>

      <div className="orders-container">
        <button className="dashboard-btn" onClick={() => navigate("/pharmacy/pharmacy-dashboard")}>
          Go to Pharmacy Dashboard
        </button>
        <h2>Pending Orders</h2>
        {orders.length > 0 ? (
          orders.map(order => (
            <div className="order-card" key={order.id}>
              <h3>{order.user?.name || "Unknown Customer"}</h3>
              <p>Medicine Quantity: {order.items[0]?.quantity || "N/A"}</p>
              <p>Phone: {order.phone}</p>
              <p>Address: {order.address}</p>
              <p>Total: ₹{order.total}</p>
              <div className="order-btns">
                <button className="confirm-btn" onClick={() => handleConfirm(order.id)}>Confirm</button>
                <button className="cancel-btn" onClick={() => handleCancel(order.id)}>Cancel</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending orders found.</p>
        )}
      </div>
    </>
  );
};

export default PendingOrders;
