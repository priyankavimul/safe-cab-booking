import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <div className="logo-container">
            <span className="logo-icon">🚕</span>
            <span className="logo-text">SafeCab</span>
          </div>
          <div className="nav-links">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>

        <main className="page-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;