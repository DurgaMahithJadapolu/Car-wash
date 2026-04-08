// ─────────────────────────────────────────────
// SparkleWash — Bookings Controller (MongoDB)
// ─────────────────────────────────────────────

const Booking = require('../models/Booking');

// GET /api/bookings
exports.getAll = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean({ virtuals: true });
    // Normalise _id -> id for frontend compatibility
    const normalised = bookings.map((b) => ({ ...b, id: b._id.toString() }));
    res.json(normalised);
  } catch (err) {
    console.error('Get bookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/bookings
exports.create = async (req, res) => {
  try {
    const {
      name, phone, email, vtype, vnum, vmod,
      svc, svcVal, amount,
      date, slot, stat, pay, staff, promo, notes,
    } = req.body;

    const booking = await Booking.create({
      name: (name || '').trim() || 'Customer',
      phone: phone || '',
      email: email || '',
      vtype: vtype || 'Hatchback',
      vnum: vnum || '',
      vmod: vmod || '',
      svc: svc || 'Basic Wash',
      svcVal: svcVal || 'Basic Wash|199',
      amount: parseInt(amount) || 199,
      date: date || new Date().toISOString().slice(0, 10),
      slot: slot || '9:00 AM',
      stat: stat || 'Pending',
      pay: pay || 'Cash',
      staff: staff || '',
      promo: promo || '',
      notes: notes || '',
      createdBy: req.userId === 'demo' ? undefined : req.userId,
    });

    res.status(201).json({ ...booking.toJSON(), id: booking._id.toString() });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/bookings/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json({ ...booking.toJSON(), id: booking._id.toString() });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/bookings/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    console.error('Delete booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
