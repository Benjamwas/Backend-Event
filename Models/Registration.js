const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Registration {
  // Create a new registration and return the record
  static async create({ name, phone, mpesa_code, event_date }) {
    const token = `TKT-${uuidv4().substring(0, 8).toUpperCase()}`;

    const [result] = await db.pool.query(
      `INSERT INTO registrations (name, phone, mpesa_code, event_date, token)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, mpesa_code, event_date, token]
    );

    return {
      id: result.insertId,
      name,
      phone,
      mpesa_code,
      event_date,
      token,
    };
  }

  // Find registration by phone number
  static async findByPhone(phone) {
    const [rows] = await db.pool.query(
      `SELECT * FROM registrations WHERE phone = ?`,
      [phone]
    );
    return rows[0]; // Return first match or undefined
  }

  // Get a registration by ID
  static async findById(id) {
    const [rows] = await db.pool.query(
      `SELECT * FROM registrations WHERE id = ?`,
      [id]
    );
    return rows[0]; // Return one object
  }

  // Update registration by ID
  static async update(id, { name, phone, mpesa_code, event_date }) {
    const [result] = await db.pool.query(
      `UPDATE registrations 
       SET name = ?, phone = ?, mpesa_code = ?, event_date = ?
       WHERE id = ?`,
      [name, phone, mpesa_code, event_date, id]
    );

    if (result.affectedRows === 0) return null;

    return this.findById(id); // Return the updated record
  }
}

module.exports = Registration;
