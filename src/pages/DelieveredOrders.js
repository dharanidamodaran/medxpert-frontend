import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliveredOrders = () => {
  const navigate = useNavigate();
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/order/orders/delivered");
        if (response.data.success) {
          const formattedOrders = response.data.data.map(order => {
            const item = order.items[0]; // Assuming one item per order
            return {
              id: order.id,
              customer: order.user?.name || "Unknown",
              medicine: item?.Medicine?.name || "Unknown",
              quantity: item?.quantity || 0,
              price: item?.price || 0,
              address: order.address || "No address provided",
              phone: order.phone || "No phone number provided",
              paymentStatus: order.Payment?.status || "Not Paid",
              orderId: order.orderId || "No Order ID",
              status: order.status || "Status unknown",
            };
          });
          setDeliveredOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch delivered orders:", error);
      }
    };

    fetchDeliveredOrders();
  }, []);

  return (
    <>
      <style>{`
        .container {
          display: flex;
          height: 100vh;
        }

        .sidenav {
          width: 200px;
          background: #008080;
          padding: 20px;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sidenav button {
          background: none;
          border: none;
          color: white;
          padding: 10px;
          text-align: left;
          cursor: pointer;
          font-size: 16px;
        }

        .sidenav button:hover {
          background: #006666;
          border-radius: 5px;
        }

        .content {
          flex: 1;
          padding: 20px;
          background: #f4f4f4;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .order-card {
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .order-card h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .order-card p {
          font-size: 14px;
          margin: 3px 0;
        }

        .order-card .order-info {
          font-weight: bold;
        }

        .order-card .status {
          color: #28a745; /* Green for delivered */
        }

        .order-card .status.pending {
          color: #ffc107; /* Yellow for pending */
        }

        .order-card .status.failed {
          color: #dc3545; /* Red for failed */
        }
      `}</style>

      <div className="container">
        {/* Sidebar Navigation */}
        <div className="sidenav">
          <button onClick={() => navigate("/pharmacy/profile")}>Profile</button>
          <button onClick={() => navigate("/pharmacy/orders/delivered")}>Orders</button>
          <button onClick={() => navigate("/logout")}>Logout</button>
        </div>

        {/* Delivered Orders Content */}
        <div className="content">
          <h2>Delivered Orders</h2>
          <div className="orders-grid">
            {deliveredOrders.map(order => (
              <div className="order-card" key={order.id}>
                <h3>{order.customer}</h3>
                <p className="order-info">Order ID: {order.orderId}</p>
                <p>Medicine: {order.medicine}</p>
                <p>Qty: {order.quantity}</p>
                <p>Price: ₹{order.price}</p>
                <p>Phone: {order.phone}</p>
                <p className={`status ${order.status.toLowerCase()}`}>
                  Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </p>
                <p>Payment Status: {order.paymentStatus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveredOrders;
