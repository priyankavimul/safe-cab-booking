import React, { useState } from 'react';
import axios from 'axios';
import './auth.css'; // Ensure lowercase 'a' to match your file

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile_number: "",
    emergency_contact: "" // The SOS Field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending only the 5 visible fields to the server
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration Successful! SOS Contact Saved.");
    } catch (err) {
      alert("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Safe Cab Account</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Safety starts with your details.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Full Name </label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>

        <div className="input-field">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="email@example.com" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        <div className="input-field">
          <label>Create Password</label>
          <input 
            type="password" 
            placeholder="enter your password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>

        <div className="input-field">
          <label>Re-Enter Password</label>
          <input 
            type="password" 
            placeholder="re-enter your password" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>

        <div className="input-field">
          <label>Mobile Number*</label>
          <input 
            type="text" 
            placeholder="+91 0000000000" 
            onChange={(e) => setFormData({...formData, mobile_number: e.target.value})} 
            required 
          />
        </div>

        <div className="input-field">
          <label>Emergency Contact (SOS)*</label>
          <input 
            type="text" 
            placeholder="Family or friend's number" 
            onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} 
            required 
          />
        </div>

        <button className="submit-btn" type="submit">Register Now</button>
      </form>
    </div>
  );
}

export default Register;