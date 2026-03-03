const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, emergencyContacts } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
 
    // create the user in neon
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'rider',
      emergencyContacts: emergencyContacts || []
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: error.message || "Registration failed" });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find user [cite: 247]
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        // 2. Check password [cite: 32, 241]
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // 3. Issue JWT Token [cite: 32, 294]
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};