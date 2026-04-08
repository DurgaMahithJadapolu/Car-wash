// ─────────────────────────────────────────────
// SparkleWash — Session Model (token-based auth)
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String, // string to support both ObjectId and 'demo'
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expireAfterSeconds: 0 }, // TTL index — MongoDB auto-deletes expired sessions
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
