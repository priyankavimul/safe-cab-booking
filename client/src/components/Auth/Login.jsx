import React, { useState } from "react";
import "./Auth.css";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Successful");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2> Welcome to the Safe Cab </h2>

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );


}

export default Login;