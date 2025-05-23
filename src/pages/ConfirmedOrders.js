import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ConfirmedOrders = () => {
  const navigate = useNavigate();
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/order/orders/confirmed');
        const data = await response.json();

        if (response.ok && data.success) {
          setConfirmedOrders(data.data);
        } else {
          setError(data.error || 'Failed to fetch confirmed orders');
        }
      } catch (error) {
        console.error('Error fetching confirmed orders:', error);
        setError('Failed to fetch confirmed orders');
      }
    };

    fetchConfirmedOrders();
  }, []);

  const handleDispatch = async (orderId) => {
    const result = await Swal.fire({
      title: 'Mark as Dispatched?',
      text: 'Are you sure you want to mark this order as dispatched?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, dispatch it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/order/order/dispatch/${orderId}`, {
          method: 'PATCH'
        });

        if (response.ok) {
          Swal.fire('Dispatched!', 'Order has been marked as dispatched.', 'success');
          setConfirmedOrders(prev => prev.filter(order => order.id !== orderId));
        } else {
          Swal.fire('Error', 'Failed to dispatch order.', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'An error occurred while dispatching.', 'error');
      }
    }
  };

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: 'Do you really want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/order/order/cancel/${orderId}`, {
          method: 'PATCH'
        });

        if (response.ok) {
          Swal.fire('Cancelled!', 'Order has been cancelled.', 'success');
          setConfirmedOrders(prev => prev.filter(order => order.id !== orderId));
        } else {
          Swal.fire('Error', 'Failed to cancel order.', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'An error occurred while cancelling.', 'error');
      }
    }
  };

  if (error) {
    return <div style={styles.message}>{error}</div>;
  }


  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/pharmacy/pharmacy-dashboard')}>
        ← Back to Dashboard
      </button>

      <h2 style={styles.title}>Confirmed Orders</h2>

      {confirmedOrders.map(order => (
        <div key={order.id} style={styles.card}>
          <h3>{order.user.name}</h3>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>

          {order.items?.length > 0 && (
            <div style={styles.medicineList}>
              <strong>Medicines:</strong>
              {order.items.map((item, index) => (
                <div key={index} style={styles.medicineItem}>
                  <span>Medicine ID: {item.medicineId}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button style={styles.dispatchBtn} onClick={() => handleDispatch(order.id)}>Dispatched</button>
            <button style={styles.cancelBtn} onClick={() => handleCancel(order.id)}>Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#009688',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    color: '#009688',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  medicineList: {
    marginTop: '10px',
    marginBottom: '10px',
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
  },
  medicineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  dispatchBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '40px',
    color: '#888',
  },
};

export default ConfirmedOrders;
