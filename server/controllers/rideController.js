const Ride = require('../models/ride');

exports.bookRide = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, dropLocation } = req.body;

        const finalDropLocation = dropLocation || dropoffLocation;

        // User is extracted from the JWT token via authMiddleware
        const userId = req.user.id;

        if (!pickupLocation || !finalDropLocation) {
            return res.status(400).json({ error: "Pickup and Dropoff locations are required" });
        }

        const newRide = await Ride.create({
            pickupLocation,
            dropLocation: finalDropLocation,
            userId,
            status: 'pending'
        });

        res.status(201).json({ message: "Ride booked successfully", ride: newRide });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ error: "Failed to book ride" });
    }
};

exports.getRideHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const rides = await Ride.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        res.json({ count: rides.length, rides });
    } catch (error) {
        console.error("Fetch rides error:", error);
        res.status(500).json({ error: "Failed to fetch ride history" });
    }
};
