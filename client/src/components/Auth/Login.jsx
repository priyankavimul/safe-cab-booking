import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert(` Welcome back, ${response.data.user.name}!`);
      navigate('/');
    } catch (error) {
      alert(" Login Failed: " + (error.response?.data?.error || "Incorrect credentials"));
    }
  };

  return (
    <div className="auth-page">
      {/* Taxi Illustration Header */}
      <div className="auth-illustration">
        <div className="city-skyline">
          <svg viewBox="0 0 400 120" className="skyline-svg">
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#B0E0E6" />
              </linearGradient>
            </defs>
            <rect width="400" height="120" fill="url(#skyGradient)" />
            {/* Buildings */}
            <rect x="20" y="40" width="30" height="80" fill="#4a5568" rx="2" />
            <rect x="25" y="45" width="8" height="6" fill="#fbbf24" opacity="0.7" />
            <rect x="37" y="45" width="8" height="6" fill="#fbbf24" opacity="0.5" />
            <rect x="25" y="55" width="8" height="6" fill="#fbbf24" opacity="0.6" />
            <rect x="37" y="55" width="8" height="6" fill="#fbbf24" opacity="0.8" />

            <rect x="60" y="25" width="35" height="95" fill="#2d3748" rx="2" />
            <rect x="65" y="30" width="8" height="6" fill="#fbbf24" opacity="0.5" />
            <rect x="80" y="30" width="8" height="6" fill="#fbbf24" opacity="0.7" />
            <rect x="65" y="42" width="8" height="6" fill="#fbbf24" opacity="0.8" />
            <rect x="80" y="42" width="8" height="6" fill="#fbbf24" opacity="0.4" />
            <rect x="65" y="54" width="8" height="6" fill="#fbbf24" opacity="0.6" />
            <rect x="80" y="54" width="8" height="6" fill="#fbbf24" opacity="0.9" />

            <rect x="105" y="50" width="25" height="70" fill="#4a5568" rx="2" />
            <rect x="110" y="55" width="6" height="5" fill="#fbbf24" opacity="0.7" />
            <rect x="120" y="55" width="6" height="5" fill="#fbbf24" opacity="0.5" />

            <rect x="280" y="30" width="30" height="90" fill="#2d3748" rx="2" />
            <rect x="285" y="35" width="8" height="6" fill="#fbbf24" opacity="0.6" />
            <rect x="297" y="35" width="8" height="6" fill="#fbbf24" opacity="0.8" />
            <rect x="285" y="47" width="8" height="6" fill="#fbbf24" opacity="0.4" />
            <rect x="297" y="47" width="8" height="6" fill="#fbbf24" opacity="0.7" />

            <rect x="320" y="45" width="35" height="75" fill="#4a5568" rx="2" />
            <rect x="325" y="50" width="8" height="6" fill="#fbbf24" opacity="0.8" />
            <rect x="340" y="50" width="8" height="6" fill="#fbbf24" opacity="0.5" />
            <rect x="325" y="62" width="8" height="6" fill="#fbbf24" opacity="0.6" />
            <rect x="340" y="62" width="8" height="6" fill="#fbbf24" opacity="0.9" />

            <rect x="365" y="55" width="25" height="65" fill="#2d3748" rx="2" />

            {/* Road */}
            <rect x="0" y="110" width="400" height="10" fill="#4a5568" />
            <line x1="0" y1="115" x2="400" y2="115" stroke="#fbbf24" strokeWidth="1" strokeDasharray="12 8" />
          </svg>
        </div>
        {/* Taxi Car */}
        <div className="taxi-car">
          <svg viewBox="0 0 160 70" className="taxi-svg">
            {/* Car body */}
            <rect x="10" y="25" width="140" height="28" rx="8" fill="#FBBF24" />
            {/* Cabin */}
            <path d="M 50 25 Q 55 5 80 5 Q 105 5 110 25" fill="#1a202c" stroke="#FBBF24" strokeWidth="1.5" />
            {/* Windows */}
            <path d="M 55 24 Q 58 10 78 10 L 78 24 Z" fill="#63b3ed" opacity="0.7" />
            <path d="M 82 24 Q 82 10 102 10 Q 105 24 105 24 Z" fill="#63b3ed" opacity="0.7" />
            {/* TAXI sign */}
            <rect x="68" y="1" width="24" height="9" rx="2" fill="#FBBF24" stroke="#d69e2e" strokeWidth="0.5" />
            <text x="80" y="8" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a202c">TAXI</text>
            {/* Headlights */}
            <circle cx="148" cy="35" r="4" fill="#fef3c7" />
            <circle cx="14" cy="35" r="4" fill="#fca5a5" opacity="0.8" />
            {/* Wheels */}
            <circle cx="40" cy="53" r="12" fill="#2d3748" />
            <circle cx="40" cy="53" r="6" fill="#718096" />
            <circle cx="40" cy="53" r="2" fill="#2d3748" />
            <circle cx="120" cy="53" r="12" fill="#2d3748" />
            <circle cx="120" cy="53" r="6" fill="#718096" />
            <circle cx="120" cy="53" r="2" fill="#2d3748" />
            {/* Door handle */}
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
            <label className="auth-label">Username</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">👤</span>
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="input-group">
            <label className="auth-label">Password</label>
            <div className="input-icon-wrapper">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="auth-input" required />
            </div>
          </div>

          <div className="remember-forgot-row">
            <label className="remember-me">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" className="submit-button">Login</button>

          <div className="social-divider">
            <span>or Register with</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn google-btn">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google
            </button>
            <button type="button" className="social-btn facebook-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;