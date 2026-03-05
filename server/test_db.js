require('dotenv').config();
const User = require('./models/User');

async function checkUser() {
    try {
        const email = 'piuvimul@gmail.com';
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log('User exists in database!');
            console.log('User ID:', user.id);
            console.log('User Name:', user.name);
            console.log('User Role:', user.role);
        } else {
            console.log('User DOES NOT exist in database!');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    } finally {
        process.exit();
    }
}

checkUser();
