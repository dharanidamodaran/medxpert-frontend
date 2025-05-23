import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DispatchedOrders = () => {
  const [dispatchedOrders, setDispatchedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDispatchedOrders();
  }, []);

  const fetchDispatchedOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order/orders/dispatched");
      setDispatchedOrders(response.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch dispatched orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/order/order/deliver/${id}`);
      Swal.fire("Success", "Order marked as delivered!", "success");
      fetchDispatchedOrders();
    } catch (error) {
      Swal.fire("Error", "Failed to mark as delivered", "error");
    }
  };

  const cancelOrder = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, cancel it!",
      });

      if (result.isConfirmed) {
        await axios.patch(`http://localhost:5000/api/order/order/cancel/${id}`);
        Swal.fire("Cancelled!", "The order has been cancelled.", "success");
        fetchDispatchedOrders();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to cancel the order", "error");
    }
  };

  return (
    <>
      <style>{`
        .orders-container {
          margin: 20px auto;
          max-width: 800px;
        }

        .order-card {
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
          margin-bottom: 15px;
        }

        .btn {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 48%;
          margin-top: 10px;
        }

        .delivered-btn {
          background: #17A2B8;
          color: white;
        }

        .cancel-btn {
          background: #dc3545;
          color: white;
        }

        .back-btn {
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }

        .back-btn span {
          margin-left: 5px;
          font-weight: bold;
        }

        .no-data {
          text-align: center;
          margin-top: 40px;
          font-size: 18px;
          color: #666;
        }
      `}</style>

      <div className="orders-container">
        <button className="back-btn" onClick={() => navigate("/pharmacy/pharmacy-dashboard")}>
          ← <span>Back to Dashboard</span>
        </button>

        <h2>Dispatched Orders</h2>

        {loading ? (
          <p>Loading...</p>
        ) : dispatchedOrders.length === 0 ? (
          <div className="no-data">No dispatched orders found.</div>
        ) : (
          dispatchedOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>{order.user?.name || "Unknown Patient"}</h3>
              <p>Order ID: {order.orderId}</p>
              <p>Phone: {order.phone}</p>
              <p>Address: {order.address}</p>
              <p>Quantity: {order.items?.[0]?.quantity || "N/A"}</p>
              <p>Total: ₹{order.total}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn delivered-btn" onClick={() => markAsDelivered(order.id)}>
                  Mark as Delivered
                </button>
                <button className="btn cancel-btn" onClick={() => cancelOrder(order.id)}>
                  Cancel Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DispatchedOrders;
