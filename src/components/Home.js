import React from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';


const departments = [
  { name: 'Cardiology', icon: '❤️' },
  { name: 'Surgeon', icon: '🏥' },
  { name: 'Pediatrics', icon: '👶' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Gynaecology', icon: '💖' },
  { name: 'Neurology', icon: '🧠' },
  { name: 'ENT Specialist', icon: '👂' },
  { name: 'Psychiatrist', icon: '🧠' },
  { name: 'Ophthalmologist', icon: '👁️' },
  { name: 'Dermatologist', icon: '🧴' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">MedXpert</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#about">About</a></li>
          <li><a href="#departments">Departments</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">MedXpert</span></h1>
          <p>Your Health, Our Priority – Connecting Patients & Doctors Seamlessly.</p>
          <div className="hero-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="explore-btn">Explore Services</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About MedXpert</h2>
        <p>Your trusted healthcare partner, ensuring seamless and secure medical experiences.</p>

        <div className="about-content">
          <div className="about-text">
            <h3>💡 Who We Are</h3>
            <p>MedXpert is a digital healthcare platform that provides easy access to medical records, trusted doctors, and seamless teleconsultation services.</p>
          </div>
          <div className="about-text">
            <h3>🎯 Our Mission</h3>
            <p>We aim to revolutionize healthcare by providing secure, accessible, and efficient medical solutions for patients and doctors.</p>
          </div>
          <div className="about-text">
            <h3>📦 What We Offer</h3>
            <p>
              MedXpert delivers comprehensive care by connecting you with trusted doctors, 
              safeguarding your health data with top-tier security.
            </p>
          </div>

        </div>

      </section>



      {/* Departments Section */}
      <section id="departments" className="departments-section">
        <h2 className="section-title">Our Departments</h2>
        <div className="departments-row">
          {departments.slice(0, 6).map((dept, index) => (
            <div key={index} className="circle-card">
              <span className="circle-icon">{dept.icon}</span>
              <p className="circle-text">{dept.name}</p>
            </div>
          ))}
        </div>
        <div className="departments-row">
          {departments.slice(6).map((dept, index) => (
            <div key={index} className="circle-card">
              <span className="circle-icon">{dept.icon}</span>
              <p className="circle-text">{dept.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-container">
          <div className="service-card">
            <div className="card-content">
              <i className="fas fa-file-medical service-icon"></i>
              <h3>EHR System</h3>
              <p>Access and manage your complete medical history seamlessly.</p>
            </div>
          </div>
          <div className="service-card">
            <div className="card-content">
              <i className="fas fa-stethoscope service-icon"></i>
              <h3>Live Consultation</h3>
              <p>Video, audio, and chat support for instant doctor consultations.</p>
            </div>
          </div>
          <div className="service-card">
            <div className="card-content">
              <i className="fas fa-ambulance service-icon"></i>
              <h3>Ambulance Service</h3>
              <p>Emergency assistance available 24/7 for quick response.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="section-title">What Our Patients Say</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2921/2921826.png" alt="Healthcare Icon" className="testimonial-icon" />
            <p className="testimonial-text">"Great pharmacy service and fast delivery!"</p>
            <p className="testimonial-author">- Alex P.</p>
          </div>
          <div className="testimonial-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2921/2921816.png" alt="EHR Icon" className="testimonial-icon" />
            <p className="testimonial-text">"The EHR system is a game-changer!"</p>
            <p className="testimonial-author">- John D.</p>
          </div>
          <div className="testimonial-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2921/2921859.png" alt="Support Icon" className="testimonial-icon" />
            <p className="testimonial-text">"Exceptional support team and quick response times!"</p>
            <p className="testimonial-author">- Sophia L.</p>
          </div>
        </div>
      </section>

      {/* Why Choose MedXpert Section */}
      <section id="why-choose" className="why-choose-section">
        <h2>Why Choose MedXpert?</h2>
        <div className="why-choose-container">
          <div className="why-choose-card">
            <i className="fas fa-lock"></i>
            <p>Secure & Easy Access to Medical Records</p>
          </div>
          <div className="why-choose-card">
            <i className="fas fa-user-md"></i>
            <p>Trusted & Certified Doctors</p>
          </div>
          <div className="why-choose-card">
            <i className="fas fa-headset"></i>
            <p>24/7 Support & Emergency Services</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 MedXpert. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a> |
            <a href="/terms">Terms of Service</a> |
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;