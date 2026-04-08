import React, { useState, useEffect, useRef } from 'react';

const ini = (name) =>
  (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Header = ({ session, onNewBooking, onProfile, onSettings, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pillRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleMenuAction = (fn) => {
    setMenuOpen(false);
    fn();
  };

  return (
    <div className="header">
      {/* Logo */}
      <div className="logo">
        <div className="logo-icon">🚗</div>
        SparkleWash
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* New Booking button - shown when logged in */}
        {session && (
          <button className="header-btn" onClick={onNewBooking}>+ New Booking</button>
        )}

        {/* User pill - shown when logged in */}
        {session ? (
          <div
            ref={pillRef}
            className={`user-pill${menuOpen ? ' open' : ''}`}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          >
            {/* Avatar */}
            <div className="user-av" style={{ color: '#085041' }}>
              {ini(session.name)}
            </div>

            {/* Name + role */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-nm">{session.name.split(' ')[0]}</span>
              <span className="user-role">My Account</span>
            </div>

            {/* Chevron */}
            <span className="chevron">▾</span>

            {/* Dropdown menu */}
            <div className={`user-menu${menuOpen ? ' open' : ''}`}>
              {/* Menu head */}
              <div className="um-head">
                <div className="um-av-big" style={{ color: '#085041' }}>
                  {ini(session.name)}
                </div>
                <div className="um-name">{session.name}</div>
                <div className="um-email">{session.email}</div>
              </div>

              {/* New Booking inside menu too */}
              <div
                className="um-item"
                onClick={(e) => { e.stopPropagation(); handleMenuAction(onNewBooking); }}
              >
                <span className="um-icon" style={{ background: '#E1F5EE', fontSize: 14 }}>➕</span>
                New Booking
              </div>

              <div
                className="um-item"
                onClick={(e) => { e.stopPropagation(); handleMenuAction(onProfile); }}
              >
                <span className="um-icon" style={{ background: '#EEEDFE', fontSize: 14 }}>👤</span>
                My Profile
              </div>

              <div
                className="um-item"
                onClick={(e) => { e.stopPropagation(); handleMenuAction(onSettings); }}
              >
                <span className="um-icon" style={{ background: '#E6F1FB', fontSize: 14 }}>⚙️</span>
                Settings
              </div>

              <div className="um-divider" />

              <div
                className="um-item danger"
                onClick={(e) => { e.stopPropagation(); handleMenuAction(onLogout); }}
              >
                <span className="um-icon">🚪</span>
                Sign Out
              </div>
            </div>
          </div>
        ) : (
          /* Show button when logged out */
          <button className="header-btn" onClick={onNewBooking}>+ New Booking</button>
        )}

      </div>
    </div>
  );
};

export default Header;