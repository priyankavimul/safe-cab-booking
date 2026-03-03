// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false // This is required for connecting to Neon
//     }
// });

// // This tests the connection
// pool.connect()
//     .then(() => console.log(" Database connected successfully!"))
//     .catch((err) => console.log(" Database connection error:", err));

// module.exports = pool;

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create the Sequelize instance instead of a Pool
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Keeps your console clean
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Neon [cite: 294]
    }
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log(' Sequelize connected to Neon!'))
  .catch(err => console.error('Unable to connect:', err));

module.exports = sequelize;