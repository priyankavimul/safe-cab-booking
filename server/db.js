const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This is required for connecting to Neon
    }
});

// This tests the connection
pool.connect()
    .then(() => console.log(" Database connected successfully!"))
    .catch((err) => console.log(" Database connection error:", err));

module.exports = pool;