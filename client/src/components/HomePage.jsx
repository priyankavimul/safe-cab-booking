import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // State for the ride details
    const [rideDetails, setRideDetails] = useState({
        pickupLocation: '',
        pickupLat: null,
        pickupLng: null,
        dropLocation: ''
    });
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // 1. Auth Check on Load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!token || !storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    // 2. Get Exact GPS Location
    const handleGetCurrentLocation = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setRideDetails({
                        ...rideDetails,
                        pickupLat: position.coords.latitude,
                        pickupLng: position.coords.longitude,
                        pickupLocation: "📍 My Current GPS Location"
                    });
                    setIsLoadingLocation(false);
                },
                (error) => {
                    alert("❌ Please allow location permissions in your browser.");
                    setIsLoadingLocation(false);
                }
            );
        } else {
            alert("❌ Geolocation is not supported by your browser.");
            setIsLoadingLocation(false);
        }
    };

    const handleChange = (e) => {
        setRideDetails({ ...rideDetails, [e.target.name]: e.target.value });
    };

    // 3. Send Data to Huzaif's Backend
    const handleBookRide = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Grab the wristband

        try {
            const response = await axios.post('http://localhost:5000/api/rides/request',
                rideDetails,
                { headers: { Authorization: `Bearer ${token}` } } // Send token for security
            );
            alert("✅ " + response.data.message);
            // Reset form after booking
            setRideDetails({ pickupLocation: '', pickupLat: null, pickupLng: null, dropLocation: '' });
        } catch (error) {
            alert("❌ Booking Failed: " + (error.response?.data?.error || "Server error"));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // -- UI STYLING --
    const styles = {
        container: { maxWidth: '500px', margin: '40px auto', padding: '25px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        title: { fontSize: '24px', fontWeight: 'bold', color: '#111', margin: 0 },
        logoutBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
        card: { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '15px', padding: '20px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', marginLeft: '12px', fontWeight: '500' },
        input: { width: '100%', padding: '14px 18px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '25px', boxSizing: 'border-box', outline: 'none' },
        locationRow: { display: 'flex', gap: '10px', alignItems: 'center' },
        gpsBtn: { padding: '14px', backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' },
        submitBtn: { width: '100%', padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)', marginTop: '10px' }
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Hi, {user.name}! 👋</h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Where to today?</p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
            </div>

            <div style={styles.card}>
                <form onSubmit={handleBookRide}>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pickup Location</label>
                        <div style={styles.locationRow}>
                            <input type="text" name="pickupLocation" placeholder="Enter pickup address..." value={rideDetails.pickupLocation} onChange={handleChange} style={styles.input} required />
                            <button type="button" onClick={handleGetCurrentLocation} style={styles.gpsBtn} disabled={isLoadingLocation}>
                                {isLoadingLocation ? "⏳" : "📍 Locate Me"}
                            </button>
                        </div>
                        {rideDetails.pickupLat && (
                            <p style={{ fontSize: '11px', color: '#10b981', marginLeft: '12px', marginTop: '6px' }}>✓ GPS Coordinates secured</p>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Drop-off Location</label>
                        <input type="text" name="dropLocation" placeholder="Where do you want to go?" value={rideDetails.dropLocation} onChange={handleChange} style={styles.input} required />
                    </div>

                    <button type="submit" style={styles.submitBtn}>Request Safe Cab</button>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
