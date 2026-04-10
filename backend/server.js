// ─────────────────────────────────────────────
// SparkleWash — Server Entry Point (MongoDB)
// ─────────────────────────────────────────────

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ── Connect to MongoDB ─────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────
const allowedOrigins = [
  process.env.CORS_ORIGIN ||
  'https://car-wash-w87f.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ── Routes ─────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));

// ── Health check ───────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚗 SparkleWash API is running', version: '2.0.0', db: 'MongoDB' });
});

// ── Favicon (prevent 500 proxy errors) ─────────
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ── 404 ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚗 SparkleWash backend running at http://localhost:${PORT}`);
  console.log(`   Database: MongoDB (Mongoose)\n`);
});
