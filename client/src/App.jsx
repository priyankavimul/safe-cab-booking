import React from 'react';
// This line MUST include 'BrowserRouter as Router' to fix your error
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Redirects to register so you don't see a blank page */}
          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
}

// This line fixes the 'Does not provide an export named default' error
export default App;