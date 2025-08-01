const db = require('../config/db');

// Create a new registration
const createRegistration = async (req, res) => {
  try {
    const { name, phone, mpesa_code, event_date } = req.body;

    // Validate required fields
    if (!name || !phone || !mpesa_code || !event_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedDate = new Date(event_date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid event date format' });
    }

    // Check if phone already registered
    const [existing] = await db.query(
      'SELECT * FROM registrations WHERE phone = ?',
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
      'INSERT INTO registrations (name, phone, mpesa_code, event_date) VALUES (?, ?, ?, ?)',
      [name, phone, mpesa_code, parsedDate]
    );

    // Fetch inserted record
    const [newRecord] = await db.query(
      'SELECT * FROM registrations WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Registration successful',
      data: newRecord[0],
    });
  } catch (error) {
    console.error('Create Registration Error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all registrations
const getAllRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.query(
      'SELECT * FROM registrations ORDER BY created_at DESC'
    );
    return res.status(200).json({ data: registrations });
  } catch (error) {
    console.error('Get All Registrations Error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get registration by ID
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM registrations WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    return res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error('Get Registration By ID Error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update registration by ID
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, mpesa_code, event_date } = req.body;

    const parsedDate = new Date(event_date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid event date format' });
    }

    const [result] = await db.query(
      'UPDATE registrations SET name = ?, phone = ?, mpesa_code = ?, event_date = ? WHERE id = ?',
      [name, phone, mpesa_code, parsedDate, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found or unchanged' });
    }

    const [updated] = await db.query(
      'SELECT * FROM registrations WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      message: 'Registration updated',
      data: updated[0],
    });
  } catch (error) {
    console.error('Update Registration Error:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
};
