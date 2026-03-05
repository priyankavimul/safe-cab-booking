const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const { protect } = require('../middlewere/authMIddleware');

// Protected routes - require valid JWT token
router.post('/', protect, rideController.bookRide);
router.get('/', protect, rideController.getRideHistory);

module.exports = router;
