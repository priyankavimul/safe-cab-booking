const pool = require('../db');
const bcrypt = require('bcryptjs');

// Register Logic
const registerUser = async (req, res) => {
    const { name, email, mobile_number, password, emergency_contacts } = req.body;
    try {
        // Scramble the password so it is safe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO users (name, email, mobile_number, password, emergency_contacts) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, mobile_number, hashedPassword, emergency_contacts]
        );
        res.json({ message: "Success!", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Email already exists!" });
    }
};

module.exports = { registerUser };