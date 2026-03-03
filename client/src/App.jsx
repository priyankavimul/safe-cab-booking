import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav style={{ padding: "20px", background: "#f0f0f0", marginBottom: "20px" }}>
          <Link to="/register" style={{ marginRight: "15px" }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          
        <Route path="/" element={<Register />} /> 
        <Route path="/register" element={<Register />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;