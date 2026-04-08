import React from 'react';

// ── Helpers ───────────────────────────────────
const ini = (name) =>
  (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const AV_COLORS = [
  ['#E1F5EE', '#0F6E56'],
  ['#E6F1FB', '#185FA5'],
  ['#EEEDFE', '#534AB7'],
  ['#FAEEDA', '#854F0B'],
  ['#FBEAF0', '#993556']
];

const avColor = (i) => AV_COLORS[i % AV_COLORS.length];

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const statusBadge = (s) => {
  if (s === 'Pending') return 'ba';
  if (s === 'In Progress') return 'bb';
  if (s === 'Completed') return 'bg';
  if (s === 'Cancelled') return 'br';
  return 'bgy';
};

const payBadge = (p) => {
  if (p === 'UPI') return 'bb';
  if (p === 'Card') return 'bp';
  return 'bt';
};

// ─────────────────────────────────────────────
// BookingTable
// ─────────────────────────────────────────────
const BookingTable = ({ bookings, onEdit, onDelete, onView }) => {
  if (!bookings.length) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Customer</th><th>Vehicle</th><th>Service</th>
              <th>Date &amp; Slot</th><th>Amount</th><th>Payment</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="9">
                <div className="empty">
                  <div className="empty-icon">🚗</div>
                  <div>No bookings yet. Click &quot;+ New Booking&quot; to add one!</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Service</th>
            <th>Date &amp; Slot</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => {
            const [bg, col] = avColor(i);
            return (
              <tr key={b.id}>
                {/* # */}
                <td style={{ color: 'var(--muted)', fontWeight: 600 }}>{i + 1}</td>

                {/* Customer */}
                <td>
                  <span
                    className="av"
                    style={{ background: bg, color: col }}
                  >
                    {ini(b.name)}
                  </span>
                  <strong>{b.name}</strong>
                  <br />
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{b.phone || ''}</span>
                </td>

                {/* Vehicle */}
                <td>
                  <span className="badge bgy">{b.vtype}</span>
                  <br />
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {b.vnum || ''} {b.vmod || ''}
                  </span>
                </td>

                {/* Service */}
                <td style={{ fontSize: 12 }}>
                  {b.svc}
                  {b.staff && (
                    <>
                      <br />
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>Staff: {b.staff}</span>
                    </>
                  )}
                </td>

                {/* Date & Slot */}
                <td style={{ color: 'var(--muted)' }}>
                  {formatDate(b.date)}
                  <br />
                  <span style={{ fontSize: 11 }}>{b.slot || ''}</span>
                </td>

                {/* Amount */}
                <td style={{ fontWeight: 700, color: '#085041', fontSize: 15 }}>
                  ₹{(parseInt(b.amount) || 0).toLocaleString('en-IN')}
                </td>

                {/* Payment */}
                <td>
                  <span className={`badge ${payBadge(b.pay)}`}>{b.pay || 'Cash'}</span>
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${statusBadge(b.stat)}`}>{b.stat || 'Pending'}</span>
                </td>

                {/* Actions */}
                <td>
                  <div className="actions">
                    <button
                      className="ab ab-v"
                      onClick={() => onView(b)}
                    >
                      View
                    </button>
                    <button
                      className="ab ab-e"
                      onClick={() => onEdit(b.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="ab ab-d"
                      onClick={() => onDelete(b.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
