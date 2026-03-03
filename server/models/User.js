// id: UUID Primary Key
// .name: Full name string.
// email: Unique email address.
// password: Hashed string (using bcrypt).
// phone: Contact number.
// role: Enum restricted to 'rider' and 'admin'.
// emergencyContacts: JSONB format to store up to 5 contacts.

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Your sequelize instance

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('rider', 'admin'),
    defaultValue: 'rider',
  },
  emergencyContacts: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Stores up to 5 contacts: {name, phone, relationship, isWhatsApp}',
  }
});

module.exports = User;