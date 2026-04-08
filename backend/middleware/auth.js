// ─────────────────────────────────────────────
// SparkleWash — Auth Middleware (MongoDB Sessions)
// ─────────────────────────────────────────────

const Session = require('../models/Session');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    }

    req.userId = session.userId;

    // Attach full user for profile access (skip DB fetch for demo user)
    if (session.userId === 'demo') {
      req.user = {
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+91 98765 43210',
        createdAt: '01 Jan 2024',
      };
    } else {
      req.user = await User.findById(session.userId);
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;
