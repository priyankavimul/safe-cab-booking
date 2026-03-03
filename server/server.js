// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const pool = require('./db'); // This pulls in the db.js file we just made!

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // A simple test route
// app.get('/', (req, res) => {
//     res.send("Safe Cab Backend is running!");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(cors()); // Allows Huzaif's React app to talk to your server
app.use(express.json()); // Allows server to read JSON data

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));