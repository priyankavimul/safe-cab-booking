import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // 1. State to hold the email and password the user types
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 2. Update state when the user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit the credentials to your Backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from refreshing

    try {
      // Send login request to your Express server
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // 4. Secure the "Wristband" (JWT Token)
      // We save the token and user details in the browser's local storage so they stay logged in
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert(`✅ Welcome back, ${response.data.user.name}!`);

      // 5. Redirect based on their role
      if (response.data.user.role === 'admin') {
        navigate('/admin'); // Send admins to the dashboard
      } else {
        navigate('/'); // Send normal riders to the Home Page
      }

    } catch (error) {
      // If the backend sends a 401 (Invalid Credentials) or 404 (Not Found)
      alert("❌ Login Failed: " + (error.response?.data?.error || "Incorrect email or password"));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Welcome Back</h2>
      <p style={{ color: 'gray', marginBottom: '20px' }}>Sign in to SmartCab</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', background: '#007BFF', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007BFF', textDecoration: 'none' }}>Create Account</Link>
      </div>
    </div>
  );
};

export default Login;