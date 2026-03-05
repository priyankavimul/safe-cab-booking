require('dotenv').config();
const User = require('./models/User');
const fs = require('fs');

async function listUsers() {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        process.exit();
    }
}

listUsers();
