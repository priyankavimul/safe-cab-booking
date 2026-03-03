import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Sending login request to Priyanka's server
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // 2. Saving the 'Hall Pass' (Token) in the browser
      localStorage.setItem("token", response.data.token);
      
      alert("Login Successful! Welcome back.");
      
      // 3. Move to the Dashboard (we will create this next)
      navigate("/dashboard");
    } catch (err) {
      // Show the error message from the backend
      alert(err.response?.data?.error || "Login Failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to Safe Cab</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

// IMPORTANT: This fixes the 'default export' error you saw earlier!
export default Login;