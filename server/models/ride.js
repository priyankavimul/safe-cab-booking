const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // Connects the ride to the user who booked it

const Ride = sequelize.define('Ride', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    pickupLocation: { type: DataTypes.STRING, allowNull: false },
    pickupLat: { type: DataTypes.FLOAT }, // Latitude from your frontend!
    pickupLng: { type: DataTypes.FLOAT }, // Longitude from your frontend!
    dropLocation: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'), defaultValue: 'pending' }
});

// Create the relationship: One User can have many Rides
User.hasMany(Ride, { foreignKey: 'userId' });
Ride.belongsTo(User, { foreignKey: 'userId' });

module.exports = Ride;