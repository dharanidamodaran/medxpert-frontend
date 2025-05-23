import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import Swal from 'sweetalert2';  // Import SweetAlert2

const BuyMedicine = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        const fetchMedicinePrices = async () => {
            try {
                console.log(state);
                const medData = state?.medications || [];
                const ehrId = state?.ehrId; // Get ehrId from location state

                const enrichedMeds = await Promise.all(
                    medData.map(async (med) => {
                        const quantity = parseInt(med.times) * parseInt(med.dosage) * parseInt(med.duration);

                        const res = await axios.get(`http://localhost:5000/api/medicine/search-medicine?name=${med.medicineName}`);
                        const price = res?.data?.data[0]?.price || 0;
                        const medicineId = res?.data?.data[0]?.id || null;

                        return {
                            ...med,
                            medicineId,
                            quantity,
                            price,
                            total: price * quantity
                        };
                    })
                );

                setMedications(enrichedMeds);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching medicine prices:", err);
                setLoading(false);
            }
        };

        fetchMedicinePrices();
    }, [state]);

    const handleCancel = () => {
        navigate('/patient/dashboard');
    };

    const handleProceedToPayment = () => {
        setShowModal(true);
    };

    const handleConfirmPayment = async () => {
        const totalPrice = calculateTotalPrice();
        const userId = sessionStorage.getItem("userId");
        const userPhone = sessionStorage.getItem("phone") || "9876543210";
        const userName = sessionStorage.getItem("userName") || "User";
        const ehrId = state?.ehrId; // Get ehrId from location state
        console.log(ehrId);

        if (!ehrId) {
            alert("Missing EHR ID. Cannot proceed with order.");
            return;
        }

        try {
            const orderPayload = {
                ehrId,
                items: medications.map(med => ({
                    medicineId: med.medicineId,
                    quantity: med.quantity,
                    price: med.price
                })),
                total: totalPrice,
                address: "Patient's Address", // You should get this from user input
                phone: userPhone,
                paymentMethod,
                ...(paymentMethod === 'upi' && { upiId: upiId || "test@upi" }) // Include UPI ID if payment method is UPI
            };

            if (paymentMethod === 'cod' || paymentMethod === 'upi') {
                // Directly confirm COD or UPI orders
                const res = await axios.post("http://localhost:5000/api/order/order-confirm", orderPayload);
                
                if (res.data && res.data.order) {
                    setShowModal(false);
                    
                    // Show SweetAlert and redirect
                    Swal.fire({
                        title: 'Order Confirmed!',
                        text: 'Your order has been successfully placed.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        navigate("/patient/dashboard");  // Redirect to patient dashboard after confirmation
                    });
                }
            } else if (paymentMethod === 'card') {
                // For card payments, first create the order
                const orderRes = await axios.post("http://localhost:5000/api/order/order-confirm", {
                    ...orderPayload,
                    status: 'pending' // Mark as pending until payment completes
                });
                
                if (orderRes.data && orderRes.data.order) {
                    // Initialize Razorpay payment
                    const options = {
                        key: "RAZORPAY_KEY_ID", // Replace with your actual key
                        amount: totalPrice * 100,
                        currency: "INR",
                        name: "MedXpert Pharmacy",
                        description: "Medicine Purchase",
                        order_id: orderRes.data.order.orderId,
                        handler: async function (response) {
                            // Payment successful - update order status
                            try {
                                const updateRes = await axios.post("http://localhost:5000/api/order/order-confirm", {
                                    orderId: orderRes.data.order.id,
                                    paymentId: response.razorpay_payment_id,
                                    status: 'paid',
                                    paymentMethod: 'card'
                                });

                                navigate("/patient/order-summary", {
                                    state: {
                                        medications,
                                        totalPrice,
                                        paymentMethod,
                                        orderId: orderRes.data.order.id,
                                        status: 'paid'
                                    }
                                });
                            } catch (err) {
                                console.error("Payment verification failed:", err);
                                alert("Payment succeeded but verification failed.");
                            }
                        },
                        prefill: {
                            name: userName,
                            email: "test@medxpert.com",
                            contact: userPhone
                        },
                        theme: {
                            color: "#008080"
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                }
            }
        } catch (err) {
            console.error("Payment/Order Error:", err);
            alert("Failed to process payment. Please try again.");
        }
    };

    const calculateTotalPrice = () => {
        return medications.reduce((total, med) => total + med.total, 0);
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading medicines...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>Buy Medicines</h1>

            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Quantity</th>
                            <th>Price (₹)</th>
                            <th>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((med, index) => (
                            <tr key={index}>
                                <td>{med.medicineName}</td>
                                <td>{med.quantity}</td>
                                <td>{med.price}</td>
                                <td>{med.total}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Price:</td>
                            <td style={{ fontWeight: 'bold' }}>₹{calculateTotalPrice()}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style={styles.buttonContainer}>
                    <button style={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                    <button style={styles.proceedButton} onClick={handleProceedToPayment}>Proceed to Payment</button>
                </div>
            </div>

            {/* Payment Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={{ color: '#00796b' }}>Select Payment Method</h2>

                        <div style={styles.radioGroup}>
                            <label>
                                <input
                                    type="radio"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                /> Cash on Delivery
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="upi"
                                    checked={paymentMethod === 'upi'}
                                    onChange={() => setPaymentMethod('upi')}
                                /> UPI Payment
                            </label>
                        </div>

                        {/* UPI Fields */}
                        {paymentMethod === 'upi' && (
                            <div style={{ marginTop: '15px' }}>
                                <div style={styles.inputGroup}>
                                    <label>UPI ID:</label>
                                    <input
                                        type="text"
                                        placeholder="yourname@upi"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <p>Or scan this QR code:</p>
                                    <QRCodeCanvas 
                                        value={`upi://pay?pa=${upiId || 'medxpert@upi'}&pn=MedXpert&am=${calculateTotalPrice()}&tn=Medicine Purchase`} 
                                        size={150} 
                                    />
                                </div>
                            </div>
                        )}

                        <div style={styles.modalButtons}>
                            <button onClick={() => setShowModal(false)} style={styles.cancelButton}>Close</button>
                            <button 
                                onClick={handleConfirmPayment} 
                                style={styles.proceedButton}
                                disabled={!paymentMethod || (paymentMethod === 'upi' && !upiId)}
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



const styles = {
    container: {
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Times New Roman, serif',
    },
    pageTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#00796b',
        marginBottom: '20px',
    },
    card: {
        backgroundColor: 'rgba(60, 197, 126, 0.1)',
        padding: '0px',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '900px',
        overflow: 'hidden'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0px'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '20px',
        gap: '10px'
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    proceedButton: {
        backgroundColor: '#00796b',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        '&:disabled': {
            backgroundColor: '#cccccc',
            cursor: 'not-allowed'
        }
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        fontFamily: 'Times New Roman, serif',
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '15px'
    },
    cardForm: {
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '10px'
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontFamily: 'Times New Roman, serif'
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px',
        gap: '10px'
    }
};

export default BuyMedicine;