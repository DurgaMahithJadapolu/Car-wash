// ─────────────────────────────────────────────
// SparkleWash — Auth Controller (MongoDB)
// ─────────────────────────────────────────────

const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');

const makeToken = () => crypto.randomBytes(32).toString('hex');

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = makeToken();
    await Session.create({ token, userId: user._id.toString() });

    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ error: 'First name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const newUser = await User.create({
      name: `${firstName} ${lastName || ''}`.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password,
    });

    res.status(201).json({ message: 'Account created successfully', user: newUser.toSafeObject() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/demo
exports.demoLogin = async (req, res) => {
  try {
    const demo = {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+91 98765 43210',
      createdAt: '01 Jan 2024',
    };

    const token = 'demo_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    await Session.create({ token, userId: 'demo' });

    res.json({ token, user: demo });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (token) {
      await Session.deleteOne({ token });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
