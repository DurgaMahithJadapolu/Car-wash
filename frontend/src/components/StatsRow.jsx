import React from 'react';

const StatsRow = ({ bookings }) => {
  const total = bookings.length;
  const pending = bookings.filter(b => b.stat === 'Pending').length;
  const completed = bookings.filter(b => b.stat === 'Completed').length;
  const revenue = bookings
    .filter(b => b.stat === 'Completed')
    .reduce((acc, b) => acc + (parseInt(b.amount) || 0), 0);

  const fmt = (n) => n.toLocaleString('en-IN');

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Total Bookings</div>
        <div className="stat-value" style={{ color: '#085041' }}>{total}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Pending</div>
        <div className="stat-value" style={{ color: '#BA7517' }}>{pending}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Completed</div>
        <div className="stat-value" style={{ color: '#1D9E75' }}>{completed}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Revenue</div>
        <div className="stat-value" style={{ color: '#534AB7', fontSize: 20 }}>
          ₹{fmt(revenue)}
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
