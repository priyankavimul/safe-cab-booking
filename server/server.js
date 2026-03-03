const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // This pulls in the db.js file we just made!

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route
app.get('/', (req, res) => {
    res.send("Safe Cab Backend is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});