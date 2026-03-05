const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
require('dotenv').config();
const sequelize = require('./db');
const User = require('./models/User');
const Ride = require('./models/ride');

const app = express();
app.use(cors());
app.use(express.json()); // Essential to read the SOS contacts array [cite: 109]

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// Sync Database
sequelize.sync({ alter: true }) // Delete the old table that has the wrong column type and build a new one using the correct UUID,
  .then(() => console.log("Database & Tables synced"))
  .catch(err => console.log(" Sync error:", err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


