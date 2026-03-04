import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      alert("❌ Registration Failed: " + (error.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="auth-page">
      {/* Taxi Illustration Header */}
      <div className="auth-illustration">
        <div className="city-skyline">
          <svg viewBox="0 0 400 120" className="skyline-svg">
            <defs>
              <linearGradient id="skyGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#B0E0E6" />
              </linearGradient>
            </defs>
            <rect width="400" height="120" fill="url(#skyGradient2)" />
            <rect x="20" y="40" width="30" height="80" fill="#4a5568" rx="2" />
            <rect x="25" y="45" width="8" height="6" fill="#fbbf24" opacity="0.7" />
            <rect x="37" y="45" width="8" height="6" fill="#fbbf24" opacity="0.5" />
            <rect x="60" y="25" width="35" height="95" fill="#2d3748" rx="2" />
            <rect x="65" y="30" width="8" height="6" fill="#fbbf24" opacity="0.5" />
            <rect x="80" y="30" width="8" height="6" fill="#fbbf24" opacity="0.7" />
            <rect x="65" y="42" width="8" height="6" fill="#fbbf24" opacity="0.8" />
            <rect x="80" y="42" width="8" height="6" fill="#fbbf24" opacity="0.4" />
            <rect x="105" y="50" width="25" height="70" fill="#4a5568" rx="2" />
            <rect x="280" y="30" width="30" height="90" fill="#2d3748" rx="2" />
            <rect x="285" y="35" width="8" height="6" fill="#fbbf24" opacity="0.6" />
            <rect x="297" y="35" width="8" height="6" fill="#fbbf24" opacity="0.8" />
            <rect x="320" y="45" width="35" height="75" fill="#4a5568" rx="2" />
            <rect x="325" y="50" width="8" height="6" fill="#fbbf24" opacity="0.8" />
            <rect x="340" y="50" width="8" height="6" fill="#fbbf24" opacity="0.5" />
            <rect x="365" y="55" width="25" height="65" fill="#2d3748" rx="2" />
            <rect x="0" y="110" width="400" height="10" fill="#4a5568" />
            <line x1="0" y1="115" x2="400" y2="115" stroke="#fbbf24" strokeWidth="1" strokeDasharray="12 8" />
          </svg>
        </div>
        <div className="taxi-car">
          <svg viewBox="0 0 160 70" className="taxi-svg">
            <rect x="10" y="25" width="140" height="28" rx="8" fill="#FBBF24" />
            <path d="M 50 25 Q 55 5 80 5 Q 105 5 110 25" fill="#1a202c" stroke="#FBBF24" strokeWidth="1.5" />
            <path d="M 55 24 Q 58 10 78 10 L 78 24 Z" fill="#63b3ed" opacity="0.7" />
            <path d="M 82 24 Q 82 10 102 10 Q 105 24 105 24 Z" fill="#63b3ed" opacity="0.7" />
            <rect x="68" y="1" width="24" height="9" rx="2" fill="#FBBF24" stroke="#d69e2e" strokeWidth="0.5" />
            <text x="80" y="8" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a202c">TAXI</text>
            <circle cx="148" cy="35" r="4" fill="#fef3c7" />
            <circle cx="14" cy="35" r="4" fill="#fca5a5" opacity="0.8" />
            <circle cx="40" cy="53" r="12" fill="#2d3748" />
            <circle cx="40" cy="53" r="6" fill="#718096" />
            <circle cx="40" cy="53" r="2" fill="#2d3748" />
            <circle cx="120" cy="53" r="12" fill="#2d3748" />
            <circle cx="120" cy="53" r="6" fill="#718096" />
            <circle cx="120" cy="53" r="2" fill="#2d3748" />
            <rect x="70" y="33" width="12" height="2" rx="1" fill="#d69e2e" />
          </svg>
        </div>
      </div>

      {/* Auth Card */}
      <div className="auth-container">
        {/* Toggle Tabs */}
        <div className="auth-tabs">
          <Link to="/login" className={`auth-tab ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
          <Link to="/register" className={`auth-tab ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="auth-label">Full Name</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">👤</span>
              <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Email Address</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">✉️</span>
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Phone Number</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">📱</span>
              <input type="text" name="phone" placeholder="Enter your number" value={formData.phone} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="auth-row">
            <div style={{ flex: 1 }}>
              <label className="auth-label">Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="auth-input" required />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="auth-label">Confirm</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="auth-input" required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Gender</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">⚧</span>
              <select name="gender" value={formData.gender} onChange={handleChange} className="auth-select">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="divider"></div>

          <div className="contact-header">Emergency Contacts ({formData.emergencyContacts.length}/5)</div>

          {formData.emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="input-group">
                <div className="input-icon-wrapper">
                  <span className="input-icon">👤</span>
                  <input type="text" placeholder="Contact Name" value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)} className="auth-input" required />
                </div>
              </div>
              <div className="auth-row" style={{ marginBottom: 0 }}>
                <div style={{ flex: 3 }}>
                  <div className="input-icon-wrapper">
                    <span className="input-icon">📞</span>
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

          <button type="submit" className="submit-button">Register Account</button>
        </form>
      </div>
    </div>
  );
};

export default Register;