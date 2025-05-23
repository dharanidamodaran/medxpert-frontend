import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const navigate = useNavigate();

    // Dummy prescription medicines (replace with backend data later)
    const [cart, setCart] = useState([
        { id: 1, name: "Paracetamol", price: 50, quantity: 1 },
        { id: 2, name: "Amoxicillin", price: 120, quantity: 1 },
        { id: 3, name: "Cough Syrup", price: 90, quantity: 1 }
    ]);

    // Handle quantity change
    const handleQuantityChange = (id, newQuantity) => {
        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
    };

    // Remove medicine from cart
    const removeFromCart = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        alert("Proceeding to Checkout...");
        navigate('/checkout');  // ✅ Redirect to checkout page
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>🛒 Cart</h2>

            {cart.length === 0 ? (
                <p style={styles.emptyMessage}>Your cart is empty 😢</p>
            ) : (
                <div style={styles.cartItems}>
                    {cart.map((item) => (
                        <div key={item.id} style={styles.cartItem}>
                            <div>
                                <p style={styles.medicineName}>{item.name}</p>
                                <p>💰 ₹{item.price} / unit</p>
                            </div>

                            <div style={styles.actions}>
                                <label>Qty: </label>
                                <select
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                    style={styles.select}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qty => (
                                        <option key={qty} value={qty}>{qty}</option>
                                    ))}
                                </select>

                                <button onClick={() => removeFromCart(item.id)} style={styles.removeButton}>
                                    ❌ Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div style={styles.totalContainer}>
                        <h3>🧾 Total: ₹{getTotalPrice()}</h3>
                        <button style={styles.checkoutButton} onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;

const styles = {
    container: {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Times New Roman, serif'
    },
    heading: {
        fontSize: '32px',
        color: '#00796b',
        textAlign: 'center',
        marginBottom: '20px'
    },
    cartItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    medicineName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#00796b'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    select: {
        padding: '5px 10px',
        borderRadius: '6px',
        border: '1px solid #ccc'
    },
    removeButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s'
    },
    removeButtonHover: {
        backgroundColor: '#d32f2f'
    },
    totalContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px'
    },
    checkoutButton: {
        backgroundColor: '#00796b',
        color: '#fff',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '8px',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'background 0.3s'
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#555'
    }
};
