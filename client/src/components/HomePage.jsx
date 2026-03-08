import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiMaximize, FiMinimize, FiArrowLeft, FiMapPin, FiSearch, FiBell, FiBriefcase, FiHome, FiPlus } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import './Home.css';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Custom Pick-up / Drop-off Markers
const pickupIcon = new L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-md"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const dropoffIcon = new L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-4 h-4 bg-red-500 rounded-sm border-[3px] border-white shadow-md"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Component to dynamically change map view
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

// Helper for fetching Address via Nominatim
const getAddressFromCoords = async (lat, lng) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const parts = response.data.display_name.split(',');
        return parts.slice(0, 2).join(',').trim(); // Returns "Andheri East, Railway Station" format roughly
    } catch (error) {
        return "Selected Location";
    }
};

// Interactive Map Click Component
const MapClickHandler = ({ rideDetails, setRideDetails, activeInput, setActiveInput, setPickupSuggestions, setDropSuggestions }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;

            // Determine which field to update based on activeInput, or fallback to filling empty fields
            let target = 'drop'; // default

            if (activeInput === 'pickup') {
                target = 'pickup';
            } else if (activeInput === 'drop') {
                target = 'drop';
            } else if (!rideDetails.pickupLocation || rideDetails.pickupLocation === "Your Current Location" || rideDetails.pickupLocation === "Locating...") {
                target = 'pickup';
            }

            if (target === 'pickup') {
                setRideDetails(prev => ({ ...prev, pickupLat: lat, pickupLng: lng, pickupLocation: "Loading..." }));
                const address = await getAddressFromCoords(lat, lng);
                setRideDetails(prev => ({ ...prev, pickupLat: lat, pickupLng: lng, pickupLocation: address }));
                setPickupSuggestions([]);
            } else {
                setRideDetails(prev => ({ ...prev, dropLat: lat, dropLng: lng, dropLocation: "Loading..." }));
                const address = await getAddressFromCoords(lat, lng);
                setRideDetails(prev => ({ ...prev, dropLat: lat, dropLng: lng, dropLocation: address }));
                setDropSuggestions([]);
            }

            // Auto-switch focus visually or close dropdowns
            setActiveInput(null);
        },
    });
    return null;
};

// Leaflet Routing Machine Component
const RoutingControl = ({ pickupLat, pickupLng, dropLat, dropLng, setRouteMetrics }) => {
    const map = useMap();

    useEffect(() => {
        if (!pickupLat || !pickupLng || !dropLat || !dropLng) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pickupLat, pickupLng),
                L.latLng(dropLat, dropLng)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#0066FF', opacity: 0.8, weight: 6 }]
            },
            createMarker: () => null // We'll manage our own markers
        }).addTo(map);

        routingControl.on('routesfound', function (e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            // distance is in meters, convert to km. time is in seconds, convert to minutes.
            setRouteMetrics({
                distance: (summary.totalDistance / 1000).toFixed(1) + ' km',
                time: Math.round(summary.totalTime % 3600 / 60) + ' min'
            });
        });

        return () => map.removeControl(routingControl);
    }, [map, pickupLat, pickupLng, dropLat, dropLng, setRouteMetrics]);

    return null;
};

const HomePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [routeMetrics, setRouteMetrics] = useState(null);

    // Ride Details State
    const [rideDetails, setRideDetails] = useState({
        pickupLocation: '',
        pickupLat: 19.0760, // Default Mumbai Latitude
        pickupLng: 72.8777, // Default Mumbai Longitude
        dropLocation: '',
        dropLat: null,
        dropLng: null,
        vehicleType: 'Cab Economy'
    });

    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // --- Forward Geocoding State (Search Autocomplete) ---
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropSuggestions, setDropSuggestions] = useState([]);
    const [activeInput, setActiveInput] = useState(null); // 'pickup' or 'drop'
    const [typingTimeout, setTypingTimeout] = useState(null);

    // --- Address Search logic ---
    const [isSearchMode, setIsSearchMode] = useState(false);

    const fetchSuggestions = async (query, type) => {
        if (!query || query.length < 3) {
            if (type === 'pickup') setPickupSuggestions([]);
            if (type === 'drop') setDropSuggestions([]);
            return;
        }
        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5,
                    countrycodes: 'in' // Limit to India for better localized results initially
                }
            });
            if (type === 'pickup') setPickupSuggestions(response.data);
            if (type === 'drop') setDropSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleLocationChange = (e, type) => {
        const query = e.target.value;
        setRideDetails(prev => ({
            ...prev,
            [type === 'pickup' ? 'pickupLocation' : 'dropLocation']: query
        }));
        setActiveInput(type);

        if (typingTimeout) clearTimeout(typingTimeout);
        const newTimeout = setTimeout(() => {
            fetchSuggestions(query, type);
        }, 500);
        setTypingTimeout(newTimeout);
    };

    const selectLocation = (suggestion, type) => {
        const lat = parseFloat(suggestion.lat);
        const lon = parseFloat(suggestion.lon);
        // Format a clean address name
        const displayNameParts = suggestion.display_name.split(',');
        const shortName = displayNameParts[0];
        const cityOrArea = displayNameParts.length > 1 ? displayNameParts[1].trim() : '';
        const combinedName = cityOrArea ? `${shortName}, ${cityOrArea}` : shortName;

        setRideDetails(prev => ({
            ...prev,
            [type === 'pickup' ? 'pickupLocation' : 'dropLocation']: combinedName,
            [type === 'pickup' ? 'pickupLat' : 'dropLat']: lat,
            [type === 'pickup' ? 'pickupLng' : 'dropLng']: lon,
        }));

        setActiveInput(null);
        if (type === 'pickup') setPickupSuggestions([]);
        if (type === 'drop') setDropSuggestions([]);
    };

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
                async (position) => {
                    const address = await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
                    setRideDetails(prev => ({
                        ...prev,
                        pickupLat: position.coords.latitude,
                        pickupLng: position.coords.longitude,
                        pickupLocation: address
                    }));
                    setIsLoadingLocation(false);
                },
                () => {
                    console.log("Location access denied or failed.");
                    setIsLoadingLocation(false);
                }
            );
        }
    };

    const handleQuickLink = (name, lat, lng) => {
        setRideDetails(prev => ({
            ...prev,
            dropLocation: name,
            dropLat: lat,
            dropLng: lng
        }));
        setIsSearchMode(true);
        setActiveInput(null);
    };

    const handleAddSaved = () => {
        alert("Feature coming soon: Add a saved place!");
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
        <div className="relative h-[calc(100vh-65px)] w-full overflow-hidden bg-slate-100 font-sans">

            {/* Full-Screen Map Panel Behind Everything */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <MapContainer
                    center={[rideDetails.pickupLat || 19.0760, rideDetails.pickupLng || 72.8777]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false} // Moved to custom if needed, or hide to look cleaner like the ref image
                >
                    <ChangeView center={[rideDetails.pickupLat || 19.0760, rideDetails.pickupLng || 72.8777]} zoom={14} />
                    <MapClickHandler
                        rideDetails={rideDetails}
                        setRideDetails={setRideDetails}
                        activeInput={activeInput}
                        setActiveInput={setActiveInput}
                        setPickupSuggestions={setPickupSuggestions}
                        setDropSuggestions={setDropSuggestions}
                    />

                    <RoutingControl
                        pickupLat={rideDetails.pickupLat}
                        pickupLng={rideDetails.pickupLng}
                        dropLat={rideDetails.dropLat}
                        dropLng={rideDetails.dropLng}
                        setRouteMetrics={setRouteMetrics}
                    />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Pickup Marker */}
                    {rideDetails.pickupLat && rideDetails.pickupLng && (
                        <Marker position={[rideDetails.pickupLat, rideDetails.pickupLng]} icon={pickupIcon} />
                    )}

                    {/* Dropoff Marker */}
                    {rideDetails.dropLat && rideDetails.dropLng && (
                        <Marker position={[rideDetails.dropLat, rideDetails.dropLng]} icon={dropoffIcon} />
                    )}

                </MapContainer>
            </div>

            {/* Exit Full Screen Floating Button (Visible only when Full Screen is ON) */}
            {isFullScreen && (
                <button
                    onClick={() => setIsFullScreen(false)}
                    className="absolute top-6 right-6 z-20 flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-800 shadow-xl border border-slate-200 hover:bg-slate-50 transition-all animate-in fade-in zoom-in duration-300"
                >
                    <FiMinimize size={18} /> Exit Full Screen
                </button>
            )}

            {/* Floating Booking Overlay */}
            {/* Responsiveness: Centers on both desktop and mobile entirely. Fades beautifully when full screen is toggled. */}
            <div className={`absolute left-1/2 top-1/2 z-10 w-[90%] md:w-[400px] flex flex-col gap-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${isFullScreen ? 'opacity-0 scale-95 pointer-events-none -translate-x-1/2 -translate-y-[45%]' : 'opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2'}`}>

                {/* Top SmartCab Branding Pill */}
                <div className="absolute -top-60 left-1/2 w-full -translate-x-1/2 flex flex-row items-center justify-between bg-white/90 backdrop-blur-xl border border-white/60 rounded-full py-3 px-5 shadow-lg max-w-[500px]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#0066FF] text-white p-1.5 rounded-full"><FiSearch size={14} /></div>
                        <span className="font-bold text-slate-800 tracking-tight text-[15px]">SmartCab</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <FiBell className="text-slate-600 hover:text-slate-900 cursor-pointer" size={20} />
                        <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white/80 shadow-sm overflow-hidden cursor-pointer flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-xs">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                    </div>
                </div>

                {/* Container 1: Location Inputs (Solid White Panel) */}
                <div className="rounded-[32px] bg-white/85 backdrop-blur-2xl p-6 shadow-2xl border border-white/60 relative w-full flex flex-col">

                    {/* Maximize Button - Floating inside layout */}
                    <button
                        onClick={() => setIsFullScreen(true)}
                        className="absolute -top-3 -right-3 p-2 text-slate-700 bg-white shadow-lg border border-slate-200 hover:bg-slate-50 rounded-full transition-colors z-30"
                        title="Enter Full Screen Map"
                    >
                        <FiMaximize size={16} />
                    </button>

                    {!isSearchMode && (!rideDetails.pickupLat || !rideDetails.dropLat) ? (
                        <div className="flex flex-col w-full gap-5">
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto md:hidden absolute top-3 left-1/2 -translate-x-1/2" />

                            {/* Where to Input Trigger */}
                            <div
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors rounded-2xl p-4 flex items-center gap-3 cursor-pointer mt-2 md:mt-2"
                                onClick={() => setIsSearchMode(true)}
                            >
                                <FiSearch className="text-blue-600 outline-none" size={20} />
                                <span className="text-slate-500 font-medium text-[16px]">Where to?</span>
                            </div>

                            {/* Quick Links Row */}
                            <div className="flex flex-row gap-3 mt-1 overflow-x-auto pb-2 scrollbar-hide">
                                <button onClick={() => handleQuickLink('Bandra West, Mumbai', 19.0551, 72.8300)} className="flex items-center gap-2 bg-white shadow-sm border border-slate-100 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-colors shrink-0">
                                    <FiHome className="text-blue-600 text-sm" />
                                    <span className="text-slate-800 text-[13px] font-bold">Home</span>
                                </button>
                                <button onClick={() => handleQuickLink('Bandra Kurla Complex, Mumbai', 19.0664, 72.8703)} className="flex items-center gap-2 bg-white shadow-sm border border-slate-100 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-colors shrink-0">
                                    <FiBriefcase className="text-blue-600 text-sm" />
                                    <span className="text-slate-800 text-[13px] font-bold">Work</span>
                                </button>
                                <button onClick={handleAddSaved} className="flex items-center gap-2 bg-white shadow-sm border border-slate-100 px-4 py-2.5 rounded-full hover:bg-slate-50 transition-colors shrink-0">
                                    <FiPlus className="text-blue-600 text-sm" />
                                    <span className="text-slate-800 text-[13px] font-bold">Add saved</span>
                                </button>
                            </div>

                            {/* Recent Rides */}
                            <div className="flex flex-col mt-2">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-slate-800 text-[17px]">Recent rides</h3>
                                    <span className="text-blue-600 text-[13px] font-bold cursor-pointer hover:underline">View all</span>
                                </div>

                                <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                                    <div className="bg-slate-100 p-2.5 rounded-full text-slate-500"><FiClock size={16} /></div>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-bold text-slate-800 text-[15px]">1280 Market St</span>
                                        <span className="text-slate-500 text-[13px]">San Francisco, CA</span>
                                    </div>
                                    <span className="text-slate-400 text-[11px] font-medium">Tue, 2:45 PM</span>
                                </div>

                                <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors mt-2">
                                    <div className="bg-slate-100 p-2.5 rounded-full text-slate-500"><FiClock size={16} /></div>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-bold text-slate-800 text-[15px]">SFO International</span>
                                        <span className="text-slate-500 text-[13px]">Terminal 3, Departures</span>
                                    </div>
                                    <span className="text-slate-400 text-[11px] font-medium">Mon, 9:12 AM</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center gap-2 mb-4 mt-2 md:mt-0">
                                <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-800" onClick={() => setIsSearchMode(false)}>
                                    <FiArrowLeft size={20} />
                                </button>
                                <h3 className="font-bold text-slate-800 text-lg">Where to?</h3>
                            </div>

                            <div className="relative bg-white/50 rounded-[20px] p-3 border border-white/60 shadow-inner">
                                {/* Visual Timeline Connectors */}
                                <div className="absolute left-[30px] top-[40px] bottom-[40px] w-0.5 bg-slate-300 z-10"></div>

                                {/* Pickup Row */}
                                <div className={`flex flex-col p-2 pl-12 relative ${activeInput === 'pickup' ? 'z-50' : 'z-20'}`}>
                                    <div className="absolute left-2 top-3 flex h-4 w-4 items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-0.5">Pickup</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-none outline-none text-slate-800 text-[15px] font-bold placeholder-slate-400 py-0.5"
                                            value={isLoadingLocation && activeInput === null ? "Locating..." : (rideDetails.pickupLocation || '')}
                                            onChange={(e) => handleLocationChange(e, 'pickup')}
                                            onFocus={() => setActiveInput('pickup')}
                                            placeholder="Current location"
                                        />
                                        {/* Pickup Suggestions Dropdown */}
                                        {activeInput === 'pickup' && pickupSuggestions.length > 0 && (
                                            <ul className="absolute top-full left-0 w-[calc(100%+32px)] -ml-8 bg-white border border-slate-200 shadow-2xl rounded-2xl mt-2 z-50 overflow-hidden text-sm">
                                                {pickupSuggestions.map((s, i) => (
                                                    <li key={i} className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors text-left"
                                                        onClick={() => selectLocation(s, 'pickup')}
                                                    >
                                                        <div className="mt-0.5"><FiMapPin className="text-slate-400" size={16} /></div>
                                                        <div className="flex flex-col flex-1 overflow-hidden">
                                                            <span className="font-bold text-slate-800 text-[14px] truncate">{s.display_name.split(',')[0]}</span>
                                                            <span className="text-[11px] text-slate-500 truncate">{s.display_name}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px w-full bg-slate-200/50 my-1 ml-10"></div>

                                {/* Dropoff Row */}
                                <div className={`flex flex-col p-2 pl-12 relative ${activeInput === 'drop' ? 'z-50' : 'z-20'}`}>
                                    <div className="absolute left-2 top-3 flex h-4 w-4 items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-sm bg-slate-800"></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-0.5">Dropoff</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-none outline-none text-slate-800 text-[15px] font-bold placeholder-slate-400 py-0.5"
                                            value={rideDetails.dropLocation}
                                            onChange={(e) => handleLocationChange(e, 'drop')}
                                            onFocus={() => setActiveInput('drop')}
                                            placeholder="Where to?"
                                        />
                                        {/* Dropoff Suggestions Dropdown */}
                                        {activeInput === 'drop' && dropSuggestions.length > 0 && (
                                            <ul className="absolute top-full left-0 w-[calc(100%+32px)] -ml-8 bg-white border border-slate-200 shadow-2xl rounded-2xl mt-2 z-50 overflow-hidden text-sm">
                                                {dropSuggestions.map((s, i) => (
                                                    <li key={i} className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors text-left"
                                                        onClick={() => selectLocation(s, 'drop')}
                                                    >
                                                        <div className="mt-0.5"><FiMapPin className="text-slate-400" size={16} /></div>
                                                        <div className="flex flex-col flex-1 overflow-hidden">
                                                            <span className="font-bold text-slate-800 text-[14px] truncate">{s.display_name.split(',')[0]}</span>
                                                            <span className="text-[11px] text-slate-500 truncate">{s.display_name}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Container 2: Fare Estimate & CTA (Solid White Theme) */}
                {rideDetails.pickupLat && rideDetails.dropLat && (
                    <div className="rounded-[32px] bg-white/85 backdrop-blur-2xl p-6 shadow-2xl border border-white/60 flex flex-col gap-4">

                        {/* Title & Route Quick Overview */}
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <span className="truncate max-w-[120px]">{rideDetails.pickupLocation.split(',')[0]}</span>
                                <span className="text-slate-400">→</span>
                                <span className="truncate max-w-[120px]">{rideDetails.dropLocation.split(',')[0]}</span>
                            </h3>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-widest">Economy</span>
                        </div>

                        {/* Breakdown */}
                        <div className="flex flex-col gap-2 text-[15px] text-slate-600 px-1 font-medium mt-2">
                            <div className="flex justify-between">
                                <span>Base Fare</span>
                                <span className="text-slate-900 font-semibold">₹30</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Distance ({routeMetrics ? routeMetrics.distance : '0 km'})</span>
                                <span className="text-slate-900 font-semibold">₹{routeMetrics ? (parseFloat(routeMetrics.distance) * 12).toFixed(0) : '0'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time ({routeMetrics ? routeMetrics.time : '0 min'})</span>
                                <span className="text-slate-900 font-semibold">₹{routeMetrics ? (parseInt(routeMetrics.time) * 1.5).toFixed(0) : '0'}</span>
                            </div>
                        </div>

                        {/* Total Line */}
                        <div className="border-t border-slate-100 pt-3 px-1 flex justify-between items-end mt-1">
                            <span className="font-bold text-slate-800">Total Fare</span>
                            <span className="font-black text-[28px] text-slate-900 leading-none">
                                ₹{routeMetrics ? (
                                    30 + (parseFloat(routeMetrics.distance) * 12) + (parseInt(routeMetrics.time) * 1.5)
                                ).toFixed(0) : '0'}
                            </span>
                        </div>

                        <p className="text-[11px] text-center text-slate-500 font-medium tracking-wide">Driver earns ₹{routeMetrics ? (parseFloat(routeMetrics.distance) * 10).toFixed(0) : '0'} • Platform fee ₹10</p>

                        {/* CTA Button */}
                        <button
                            className="w-full rounded-[24px] bg-slate-900 hover:bg-black text-white font-bold text-[16px] py-4 transition-all active:scale-[0.98] shadow-lg flex justify-center items-center gap-2 mt-2"
                            onClick={handleBookRide}
                            disabled={!rideDetails.pickupLat || !rideDetails.dropLat}
                        >
                            Book SmartCab →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
