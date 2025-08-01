const db = require('../config/db');
const bcrypt = require('bcrypt');


class Admin {
  // Create a new admin with hashed password
  static async create({ username, password }) {
    const password_hash = await bcrypt.hash(password, 10); // Securely hash password

    const [result] = await db.query(
      `INSERT INTO admins (username, password_hash) VALUES (?, ?)`,
      [username, password_hash]
    );

    return {
      id: result.insertId,
      username,
      created_at: new Date(), // You may fetch it again if exact DB time is needed
    };
  }

  // Find an admin by username
  static async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT * FROM admins WHERE username = ?`,
      [username]
    );

    return rows[0]; // Return the admin if found, or undefined
  }

  // Find admin by ID
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM admins WHERE id = ?`,
      [id]
    );

    return rows[0];
  }
}

module.exports = Admin;
