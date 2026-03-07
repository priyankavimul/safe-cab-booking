import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import taxiBg from '../../assets/Gemini_Generated_Image_w88llgw88llgw88l (2).png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', gender: 'Female',
    emergencyContacts: [{ name: '', phone: '', relationship: '', isWhatsApp: true }]
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddContact = () => {
    if (formData.emergencyContacts.length < 5) {
      setFormData({ ...formData, emergencyContacts: [...formData.emergencyContacts, { name: '', phone: '', relationship: '', isWhatsApp: true }] });
    } else {
      alert("You can only add up to 5 emergency contacts.");
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index][field] = value;
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!"); return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("✅  Registration " + response.data.message);
      navigate('/login');
    } catch (error) {
      if (!error.response) {
        alert("❌ Registration Failed: Cannot connect to server. Please ensure the backend is running.");
      } else {
        alert("❌ Registration Failed: " + (error.response.data?.error || "Server error"));
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-illustration">
        <img src={taxiBg} alt="Taxi Background" className="auth-image" />
      </div>

      <div className="auth-container">
        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label className="auth-label">Full Name</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Email address</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input type="email" name="email" placeholder="davidjonson@gmail.com" value={formData.email} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Phone Number</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <input type="text" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="auth-row">
            <div style={{ flex: 1 }}>
              <label className="auth-label">Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="auth-input" required />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="auth-label">Confirm</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="auth-input" required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Gender</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="21" x2="12" y2="15"></line>
                  <circle cx="12" cy="9" r="6"></circle>
                </svg>
              </span>
              <select name="gender" value={formData.gender} onChange={handleChange} className="auth-select">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="contact-header">Emergency Contacts ({formData.emergencyContacts.length}/5)</div>

          {formData.emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="input-group">
                <div className="input-icon-wrapper">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input type="text" placeholder="Contact Name" value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)} className="auth-input" required />
                </div>
              </div>
              <div className="auth-row" style={{ marginBottom: 0 }}>
                <div style={{ flex: 3 }}>
                  <div className="input-icon-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <input type="text" placeholder="Phone Number" value={contact.phone} onChange={(e) => handleContactChange(index, 'phone', e.target.value)} className="auth-input" required />
                  </div>
                </div>
                <div style={{ flex: 2 }}>
                  <select value={contact.relationship} onChange={(e) => handleContactChange(index, 'relationship', e.target.value)} className="auth-select" required>
                    <option value="" disabled>Relation</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {formData.emergencyContacts.length < 5 && (
            <button type="button" onClick={handleAddContact} className="add-button">+ Add Another Contact</button>
          )}

          <button type="submit" className="submit-button">Sign up</button>

          <div className="bottom-nav" style={{ marginTop: '30px' }}>
            Already have an account? Go to <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;