const db = require('../config/db'); // Make sure this exports pool.promise

// Create a new registration
const createRegistration = async (req, res) => {
  try {
    const { name, phone, mpesa_code, event_date } = req.body;

    if (!name || !phone || !mpesa_code || !event_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for valid date
    if (isNaN(Date.parse(event_date))) {
      return res.status(400).json({ message: 'Invalid event date format' });
    }

    // Check if phone already exists
    const [existing] = await db.query(
      'SELECT * FROM registration WHERE phone = ?',
      [phone]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: 'Phone already registered',
        data: existing[0],
      });
    }

    // Insert registration
    const [result] = await db.query(
      'INSERT INTO registration (name, phone, mpesa_code, event_date) VALUES (?, ?, ?, ?)',
      [name, phone, mpesa_code, new Date(event_date)]
    );

    // Fetch newly inserted record
    const [newRecord] = await db.query(
      'SELECT * FROM registration WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Registration successful',
      data: newRecord[0],
    });
  } catch (error) {
    console.error('Create Registration Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all registrations
const getAllRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.query(
      'SELECT * FROM registration ORDER BY created_at DESC'
    );
    res.status(200).json({ data: registrations });
  } catch (error) {
    console.error('Get All Registrations Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM registration WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error('Get Registration By ID Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update registration by ID
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, mpesa_code, event_date } = req.body;

    const [result] = await db.query(
      'UPDATE registration SET name = ?, phone = ?, mpesa_code = ?, event_date = ? WHERE id = ?',
      [name, phone, mpesa_code, new Date(event_date), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found or not updated' });
    }

    const [updated] = await db.query(
      'SELECT * FROM registration WHERE id = ?',
      [id]
    );

    res.status(200).json({
      message: 'Registration updated',
      data: updated[0],
    });
  } catch (error) {
    console.error('Update Registration Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
};
