require('dotenv').config();
const User = require('./models/User');

async function listUsers() {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        console.log('--- ALL USERS ---');
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            users.forEach(u => console.log(`- ${u.name} (${u.email})`));
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        process.exit();
    }
}

listUsers();
