const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register Logic
exports.registerUser = async (req, res) => {
  const { name, email, password, mobile_number, emergency_contact, latitude, longitude } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, mobile_number, emergency_contact, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, email, hashedPassword, mobile_number, emergency_contact, latitude || 0, longitude || 0]
    );
    res.status(201).json({ message: "User created!", user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Registration failed." });
  }
};

// 2. Login Logic
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.rows[0].name, rating: user.rows[0].rating } });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
};