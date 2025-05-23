import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaTachometerAlt, FaUserPlus, FaSignOutAlt
} from 'react-icons/fa';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register user');
            }

            await response.json();

            Swal.fire({
                title: '✅ Registration Successful!',
                text: 'User has been registered successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate('/admin');
            }, 2000);

        } catch (error) {
            setError('Failed to register user.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <nav style={styles.sidebar}>
                <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '30px' }}>MedXpert</h2>
                <ul style={styles.ul}>
                    <li style={styles.li}>
                        <Link to="/admin" style={styles.link}>
                            <FaTachometerAlt style={styles.icon} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li style={{ ...styles.li, ...styles.logout }}>
                        <Link to="/logout" style={{ ...styles.link, color: '#f44336' }}>
                            <FaSignOutAlt style={styles.icon} />
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div style={styles.mainContent}>
                <div style={styles.formCard}>
                    <h2 style={{ marginBottom: '25px', color: '#00796b' }}>
                        <FaUserPlus style={{ marginRight: '10px' }} /> Register New User
                    </h2>

                    {error && <p style={styles.error}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Role:</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            >
                                <option value="">Select Role</option>
                                <option value="doctor">Doctor</option>
                                <option value="patient">Patient</option>
                                <option value="ambulanceStaff">Ambulance Staff</option>
                            </select>
                        </div>

                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        fontFamily: '"Times New Roman", serif',
        backgroundImage: 'url("https://images.pexels.com/photos/7587304/pexels-photo-7587304.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    sidebar: {
        width: '230px',
        background: '#008080',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 15px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
    },
    ul: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    li: {
        padding: '16px 10px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px',
        borderRadius: '6px',
        transition: 'background 0.3s',
    },
    link: {
        textDecoration: 'none',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
    },
    logout: {
        marginTop: 'auto',
    },
    icon: {
        fontSize: '20px',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(3px)',
    },
    formCard: {
        background: 'rgba(255, 255, 255, 0.15)',
        padding: '40px 50px',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        width: '450px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: '#000', // card text color
    },
    formGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        fontSize: '15px',
        marginBottom: '6px',
        fontWeight: 'bold',
        color: '#000', // updated label color to black
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        fontSize: '15px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontFamily: '"Times New Roman", serif',
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    button: {
        width: '100%',
        padding: '12px',
        background: '#00796b',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: '"Times New Roman", serif',
        transition: '0.3s ease-in-out',
    },
    error: {
        color: '#ffdddd',
        background: '#c62828',
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '15px',
        fontSize: '14px',
    },
    sidebarTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: '30px',
        padding: '15px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '5px',
        '&::before, &::after': {
          content: '"⚕"',
          fontSize: '18px'
        }
      }
};

    

export default RegisterUser;
