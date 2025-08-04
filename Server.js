const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const db = require('./config/db');

const registrationRoutes = require('./Routes/registrationRoutes');
const adminRoutes = require('./Routes/adminRoutes');

const app = express();
const port = process.env.PORT || 5003;

// Create HTTP server
const server = http.createServer(app);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://event-booking-fe.vercel.app'
];


app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you're using cookies or Authorization headers
}));
app.use(express.json());

// Test DB Connection
db.getConnection()
    .then(conn => {
        console.log('✅ Database connected successfully.');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });

// Use modular routes
app.use('/api/registration', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Hello from the Server!');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
