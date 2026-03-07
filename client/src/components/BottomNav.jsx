import React from 'react';
import { FaCar, FaMotorcycle, FaHome, FaRegUser } from 'react-icons/fa';
import { BsGrid } from 'react-icons/bs';
import { IoMdBicycle } from 'react-icons/io';

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <div className="nav-item active">
                <FaCar size={24} />
                <span>Ride</span>
            </div>
            <div className="nav-item">
                <BsGrid size={24} />
                <span>All Services</span>
            </div>
            <div className="nav-item">
                <IoMdBicycle size={24} />
                <span>Travel</span>
            </div>
            <div className="nav-item">
                <FaRegUser size={24} />
                <span>Profile</span>
            </div>
        </div>
    );
};

export default BottomNav;
