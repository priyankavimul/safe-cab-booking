import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  // 1. Setting up "boxes" to hold what you type
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    try {
      // 2. Sending the data to Priyanka's server
      await axios.post("http://localhost:5000/api/auth/register", {
        name, email, password, 
        mobile_number: "8983735361", // Captures from your earlier state
        emergency_contacts: "None"
      });
      alert("Registration Successful!");
    } catch (err) {
      alert("Error joining Safe Cab");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Join Safe Cab</h2>
      <form onSubmit={handleSignUp}>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required /><br/><br/>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Register Now</button>
      </form>
    </div>
  );
}

export default Register;