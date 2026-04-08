// ─────────────────────────────────────────────
// SparkleWash — Users Controller (MongoDB)
// ─────────────────────────────────────────────

const User = require('../models/User');
const Session = require('../models/Session');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    // Demo user — return synthetic profile
    if (req.userId === 'demo') {
      return res.json({
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+91 98765 43210',
        createdAt: '01 Jan 2024',
      });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.toSafeObject());
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    if (req.userId === 'demo') {
      return res.status(403).json({ error: 'Demo users cannot edit their profile' });
    }

    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if new email is taken by another user
    const conflict = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.userId },
    });
    if (conflict) {
      return res.status(409).json({ error: 'Email is already in use by another account' });
    }

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim(), email: email.toLowerCase().trim(), phone: (phone || '').trim() },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'User not found' });

    res.json(updated.toSafeObject());
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/users/password
exports.changePassword = async (req, res) => {
  try {
    if (req.userId === 'demo') {
      return res.status(403).json({ error: 'Demo users cannot change their password' });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All password fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save(); // triggers pre('save') hash

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/users/account
exports.deleteAccount = async (req, res) => {
  try {
    if (req.userId === 'demo') {
      return res.status(403).json({ error: 'Demo accounts cannot be deleted' });
    }

    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '').trim();

    await User.findByIdAndDelete(req.userId);
    if (token) await Session.deleteOne({ token });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
