import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  // 1. Set up the state to hold all what the user types
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    emergencyContacts: [
      { name: '', phone: '', relationship: '', isWhatsApp: true }
    ]
  });

  // 2. Handle standard text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle adding a new SOS contact (Max 5)
  const handleAddContact = () => {
    if (formData.emergencyContacts.length < 5) {
      setFormData({
        ...formData,
        emergencyContacts: [
          ...formData.emergencyContacts, 
          { name: '', phone: '', relationship: '', isWhatsApp: true }
        ]
      });
    } else {
      alert("You can only add up to 5 emergency contacts.");
    }
  };

  // 4. Handle changes specifically inside the SOS contact rows
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index][field] = value;
    setFormData({ ...formData, emergencyContacts: updatedContacts });
  };

  // 5. Submit the data to Priyanka's Backend!
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh

    // Frontend Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Send data to your Node.js server
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        emergencyContacts: formData.emergencyContacts
      });

      alert("✅ " + response.data.message);
      navigate('/login'); // Send them to the login page after success!

    } catch (error) {
      alert("❌ Registration Failed: " + (error.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Create Account</h2>
      <p>Join as a rider</p>

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="name" onChange={handleChange} required />

        <label>Email Address</label>
        <input type="email" name="email" onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="text" name="phone" onChange={handleChange} required />

        <div style={{ display: 'flex', gap: '10px' }}>
          <div>
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <div>
            <label>Confirm</label>
            <input type="password" name="confirmPassword" onChange={handleChange} required />
          </div>
        </div>

        <label>Gender</label>
        <select name="gender" onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <hr />
        
        <h4>EMERGENCY CONTACTS ({formData.emergencyContacts.length}/5)</h4>
        {formData.emergencyContacts.map((contact, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="Contact Name" 
              value={contact.name}
              onChange={(e) => handleContactChange(index, 'name', e.target.value)} 
              required 
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={contact.phone}
                onChange={(e) => handleContactChange(index, 'phone', e.target.value)} 
                required 
              />
              <select 
                value={contact.relationship}
                onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
              >
                <option value="">Relation</option>
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Friend">Friend</option>
              </select>
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddContact}>+ Add Contact</button>
        <br /><br />
        <button type="submit" style={{ width: '100%', background: 'blue', color: 'white', padding: '10px' }}>
          Register Account
        </button>
      </form>
    </div>
  );
};

export default Register;