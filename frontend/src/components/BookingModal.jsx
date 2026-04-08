import React, { useState, useEffect } from 'react';

const today = () => new Date().toISOString().slice(0, 10);

const SERVICES = [
  { label: 'Basic Wash — ₹199', value: 'Basic Wash|199' },
  { label: 'Premium Wash — ₹399', value: 'Premium Wash|399' },
  { label: 'Full Detailing — ₹999', value: 'Full Detailing|999' },
  { label: 'Interior Clean — ₹599', value: 'Interior Clean|599' },
  { label: 'Polish & Wax — ₹799', value: 'Polish & Wax|799' },
  { label: 'Engine Wash — ₹499', value: 'Engine Wash|499' }
];

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const DEFAULT_FORM = {
  name: '', phone: '', email: '',
  vtype: 'Hatchback', vnum: '', vmod: '',
  svcVal: 'Basic Wash|199',
  date: today(), slot: '9:00 AM',
  stat: 'Pending', pay: 'Cash',
  staff: '', promo: '', notes: ''
};

// ─────────────────────────────────────────────
// BookingModal
// ─────────────────────────────────────────────
const BookingModal = ({ open, editId, booking, onClose, onSave }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (booking && editId) {
        setForm({
          name: booking.name || '',
          phone: booking.phone || '',
          email: booking.email || '',
          vtype: booking.vtype || 'Hatchback',
          vnum: booking.vnum || '',
          vmod: booking.vmod || '',
          svcVal: booking.svcVal || 'Basic Wash|199',
          date: booking.date || today(),
          slot: booking.slot || '9:00 AM',
          stat: booking.stat || 'Pending',
          pay: booking.pay || 'Cash',
          staff: booking.staff || '',
          promo: booking.promo || '',
          notes: booking.notes || ''
        });
      } else {
        setForm({ ...DEFAULT_FORM, date: today() });
      }
    }
  }, [open, booking, editId]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const sv = form.svcVal.split('|');
      const payload = {
        ...form,
        name: form.name.trim() || 'Customer',
        svc: sv[0],
        amount: parseInt(sv[1]) || 0
      };
      await onSave(payload);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`overlay${open ? ' open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">🚗 Car Wash Booking</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="form-row">
            {/* Customer Name */}
            <div className="form-group full">
              <label className="form-label">Customer Name *</label>
              <input
                className="form-input"
                placeholder="Customer full name..."
                value={form.name}
                onChange={set('name')}
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={set('phone')}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="customer@email.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>

            {/* Vehicle Type */}
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select className="form-select" value={form.vtype} onChange={set('vtype')}>
                <option>Hatchback</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>MUV</option>
                <option>Bike</option>
                <option>Truck</option>
              </select>
            </div>

            {/* Vehicle Number */}
            <div className="form-group">
              <label className="form-label">Vehicle Number</label>
              <input
                className="form-input"
                placeholder="TN 01 AB 1234"
                value={form.vnum}
                onChange={set('vnum')}
              />
            </div>

            {/* Vehicle Model */}
            <div className="form-group">
              <label className="form-label">Vehicle Model</label>
              <input
                className="form-input"
                placeholder="e.g. Maruti Swift"
                value={form.vmod}
                onChange={set('vmod')}
              />
            </div>

            {/* Service */}
            <div className="form-group">
              <label className="form-label">Wash Service</label>
              <select className="form-select" value={form.svcVal} onChange={set('svcVal')}>
                {SERVICES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={set('date')}
              />
            </div>

            {/* Time Slot */}
            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <select className="form-select" value={form.slot} onChange={set('slot')}>
                {TIME_SLOTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.stat} onChange={set('stat')}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            {/* Payment Mode */}
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select className="form-select" value={form.pay} onChange={set('pay')}>
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Online</option>
              </select>
            </div>

            {/* Staff */}
            <div className="form-group">
              <label className="form-label">Staff Assigned</label>
              <input
                className="form-input"
                placeholder="Staff member name..."
                value={form.staff}
                onChange={set('staff')}
              />
            </div>

            {/* Promo */}
            <div className="form-group">
              <label className="form-label">Promo Code</label>
              <input
                className="form-input"
                placeholder="WASH10..."
                value={form.promo}
                onChange={set('promo')}
              />
            </div>

            {/* Notes */}
            <div className="form-group full">
              <label className="form-label">Special Instructions</label>
              <textarea
                className="form-textarea"
                placeholder="Any special requests or notes..."
                value={form.notes}
                onChange={set('notes')}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
