// ─────────────────────────────────────────────
// SparkleWash — Booking Model
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'Customer',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    vtype: {
      type: String,
      trim: true,
      default: 'Hatchback',
    },
    vnum: {
      type: String,
      trim: true,
      default: '',
    },
    vmod: {
      type: String,
      trim: true,
      default: '',
    },
    svc: {
      type: String,
      trim: true,
      default: 'Basic Wash',
    },
    svcVal: {
      type: String,
      trim: true,
      default: 'Basic Wash|199',
    },
    amount: {
      type: Number,
      default: 199,
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    slot: {
      type: String,
      default: '9:00 AM',
    },
    stat: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    pay: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Online'],
      default: 'Cash',
    },
    staff: {
      type: String,
      trim: true,
      default: '',
    },
    promo: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
