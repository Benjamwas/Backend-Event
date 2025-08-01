const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Registration {
  // Create a new registration and return the record
  static async create({ name, phone, mpesa_code, event_date }) {
    const token = `TKT-${uuidv4().substring(0, 8).toUpperCase()}`;

    const [result] = await db.query(
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
// Find a registration by phone number
  static async findByPhone(phone) {
    const [rows] = await db.query(
      `SELECT * FROM registrations WHERE phone = ?`,
      [phone]
    );
    return rows[0];
  }
// Find a registration by ID
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM registrations WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
// Update a registration by ID and return the updated record
  static async update(id, { name, phone, mpesa_code, event_date }) {
    const [result] = await db.query(
      `UPDATE registrations 
       SET name = ?, phone = ?, mpesa_code = ?, event_date = ?
       WHERE id = ?`,
      [name, phone, mpesa_code, event_date, id]
    );

    if (result.affectedRows === 0) return null;

    return this.findById(id);
  }
  //find all registrations
  static async findAll() {
    const [rows] = await db.query(`SELECT * FROM registrations ORDER BY created_at DESC`);
    return rows;
  }
}

module.exports = Registration;
