const Admin = require('../Models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Replace this secret with an env variable in production
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const loginAdmin = async (req, res) => {
  try {
    console.log("req body",req.body);
    const { username, password } = req.body;

    // Check if all fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find admin by username
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token valid for 1 hour
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        created_at: admin.created_at
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  loginAdmin
};
