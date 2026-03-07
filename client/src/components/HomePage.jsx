import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClock } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import './Home.css';

// Google Maps Imports
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    height: "100%",
    width: "100%"
};

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Ride Details State
    const [rideDetails, setRideDetails] = useState({
        pickupLocation: '',
        pickupLat: 21.1458, // Default Nagpur Latitude
        pickupLng: 79.0882, // Default Nagpur Longitude
        dropLocation: '',
        dropLat: null,
        dropLng: null,
        vehicleType: 'Cab Economy'
    });

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Auth Check on Load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!token || !storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            fetchCurrentLocation(); // Silently grab location on load
        }
    }, [navigate]);

    // Silently Get Exact GPS Location
    const fetchCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setIsLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setRideDetails(prev => ({
                        ...prev,
                        pickupLat: position.coords.latitude,
                        pickupLng: position.coords.longitude,
                        pickupLocation: "Your Current Location"
                    }));
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.log("Location access denied or failed.");
                    setIsLoadingLocation(false);
                }
            );
        }
    };

    const handleLocationSelect = (type, location) => {
        setRideDetails(prev => ({ ...prev, [type]: location }));
    };

    const handleVehicleSelect = (type) => {
        setRideDetails(prev => ({ ...prev, vehicleType: type }));
    };

    const handleBookRide = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/api/rides/request',
                rideDetails,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✅ " + response.data.message);
            // Reset Drop Location after booking
            setRideDetails(prev => ({ ...prev, dropLocation: '', dropLat: null, dropLng: null }));
        } catch (error) {
            alert("❌ Booking Failed: " + (error.response?.data?.error || "Server error"));
        }
    };

    if (!user) return null;

    return (
        <div className="dashboard-container">
            {/* Left Panel: Booking UI */}
            <div className="booking-panel">
                <div className="booking-header">
                    <h2>Get a ride</h2>
                </div>

                <div className="booking-form">
                    <div className="location-inputs">
                        <div className="input-row pickup-row">
                            <div className="dot-wrapper">
                                <div className="dot black-dot"></div>
                                <div className="line-connector"></div>
                            </div>
                            <input
                                type="text"
                                className="location-input"
                                value={isLoadingLocation ? "Locating..." : (rideDetails.pickupLocation || '')}
                                onChange={(e) => setRideDetails({ ...rideDetails, pickupLocation: e.target.value })}
                                placeholder="Pickup location"
                            />
                        </div>
                        <div className="input-row dropoff-row">
                            <div className="dot-wrapper">
                                <div className="square-dot"></div>
                            </div>
                            <input
                                type="text"
                                className="location-input"
                                value={rideDetails.dropLocation}
                                onChange={(e) => setRideDetails({ ...rideDetails, dropLocation: e.target.value })}
                                placeholder="Dropoff location"
                            />
                        </div>
                    </div>

                    <div className="form-dropdowns">
                        <select className="ui-select">
                            <option>Pickup now</option>
                            <option>Schedule for later</option>
                        </select>
                        <select className="ui-select">
                            <option>For me</option>
                            <option>For a friend</option>
                        </select>
                    </div>

                    <button className="search-btn" onClick={handleBookRide}>
                        Search & Request
                    </button>
                </div>

                {/* Suggestions / Recent Locations */}
                <div className="recent-locations">
                    <div className="recent-item" onClick={() => handleLocationSelect('dropLocation', 'Achraj Towers 1')}>
                        <div className="icon-circle"><FiClock /></div>
                        <div className="recent-text">
                            <h4>Achraj Towers 1</h4>
                            <p>Koradi Road, Chaoni Square, Rajnagar...</p>
                        </div>
                    </div>
                    <div className="recent-item" onClick={() => handleLocationSelect('dropLocation', 'Main Road')}>
                        <div className="icon-circle"><FiClock /></div>
                        <div className="recent-text">
                            <h4>Main Road</h4>
                            <p>Shantinagar Colony, Nagpur...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Map */}
            <div className="map-panel">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={{ lat: rideDetails.pickupLat || 21.1458, lng: rideDetails.pickupLng || 79.0882 }}
                        zoom={14}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                    >
                        {rideDetails.pickupLat && rideDetails.pickupLng && (
                            <Marker position={{ lat: rideDetails.pickupLat, lng: rideDetails.pickupLng }} />
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default HomePage;
