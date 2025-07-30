const express = require('express');
const router = express.Router();
const Registration = require('../Models/Registration');

// @route   POST /register
// @desc    Register a user for the event and return token
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, phone, mpesa_code, event_date } = req.body;

    // Basic validation
    if (!name || !phone || !mpesa_code || !event_date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already registered with same phone
    const existing = await Registration.findByPhone(phone);
    if (existing) {
      return res.status(409).json({ message: 'User already registered.' });
    }

    // Register and return token
    const newRegistration = await Registration.create({
      name,
      phone,
      mpesa_code,
      event_date,
    });

    res.status(201).json({
      message: 'Registration successful!',
      registration: newRegistration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

module.exports = router;
