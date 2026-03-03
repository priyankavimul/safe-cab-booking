const pool = require('../db');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    // This pulls data from the React form
    const { name, email, password, mobile_number, emergency_contacts } = req.body;
    
    try {
        // 1. Scramble the password for safety
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Save into your Neon 'users' table
        const result = await pool.query(
            'INSERT INTO users (name, email, password, mobile_number, emergency_contacts) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, mobile_number, emergency_contacts]
        );

        res.status(201).json({ message: "User Created!", user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed or email exists." });
    }
};