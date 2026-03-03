const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const sequelize = require('./db');
const User = require('./models/User'); // Import your model [cite: 78]

const app = express();
app.use(cors()); 
app.use(express.json()); // Essential to read the SOS contacts array [cite: 109]
app.use(require('cors')()); // Allows your React app at port 5173 to talk to this server [cite: 296, 307]

app.use('/api/auth', authRoutes);
// Sync Database
sequelize.sync({ force: true }) // Delete the old table that has the wrong column type and build a new one using the correct UUID,
  .then(() => console.log("Database & Tables synced"))
  .catch(err => console.log(" Sync error:", err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));