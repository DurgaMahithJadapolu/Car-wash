import React, { useState, useEffect } from 'react';

const ini = (name) =>
  (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// ─────────────────────────────────────────────
// ProfilePanel
// ─────────────────────────────────────────────
const ProfilePanel = ({ open, session, onClose, onSave, onToast }) => {
  const [fn, setFn] = useState('');
  const [ln, setLn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  // Populate fields when panel opens
  useEffect(() => {
    if (open && session) {
      const parts = (session.name || '').split(' ');
      setFn(parts[0] || '');
      setLn(parts.slice(1).join(' ') || '');
      setEmail(session.email || '');
      setPhone(session.phone || '');
      setMsg({ text: '', type: '' });
    }
  }, [open, session]);

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleSave = async () => {
    if (!fn.trim()) { showMsg('First name is required', 'err'); return; }
    if (!email.trim()) { showMsg('Email is required', 'err'); return; }
    if (session?.id === 'demo') { showMsg('Demo users cannot edit profile', 'err'); return; }

    setSaving(true);
    try {
      const name = (fn.trim() + ' ' + ln.trim()).trim();
      await onSave({ name, email: email.trim().toLowerCase(), phone: phone.trim() });
      showMsg('✓ Profile updated successfully!', 'ok');
      onToast('Profile saved! ✓');
    } catch (err) {
      showMsg(err.message, 'err');
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!session) return null;

  const displayName = ((fn + ' ' + ln).trim()) || session.name || '—';
  const bgColor = '#1D9E75';

  return (
    <div
      className={`panel-overlay${open ? ' open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="panel">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-title">👤 My Profile</div>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="panel-body">
          {/* Avatar row */}
          <div className="panel-avatar-row">
            <div className="panel-av" style={{ background: bgColor }}>
              {ini(displayName)}
            </div>
            <div className="panel-av-info">
              <div className="pav-name">{displayName}</div>
              <div className="pav-email">{session.email}</div>
              <div className="pav-since">Member since {session.createdAt || '—'}</div>
            </div>
          </div>

          {/* Message */}
          {msg.text && (
            <div className={`panel-msg show ${msg.type}`}>{msg.text}</div>
          )}

          {/* Edit fields */}
          <div className="panel-section">
            <div className="panel-section-title">✏️ Edit Profile Information</div>
            <div className="panel-row">
              <div className="panel-field">
                <label className="panel-label">First Name</label>
                <input
                  className="panel-input"
                  placeholder="First name"
                  value={fn}
                  onChange={e => setFn(e.target.value)}
                />
              </div>
              <div className="panel-field">
                <label className="panel-label">Last Name</label>
                <input
                  className="panel-input"
                  placeholder="Last name"
                  value={ln}
                  onChange={e => setLn(e.target.value)}
                />
              </div>
            </div>
            <div className="panel-field">
              <label className="panel-label">Email Address</label>
              <input
                className="panel-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="panel-field">
              <label className="panel-label">Phone Number</label>
              <input
                className="panel-input"
                placeholder="+91..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Read-only info */}
          <div className="panel-section">
            <div className="panel-section-title">🔒 Account Info (Read Only)</div>
            <div className="panel-field">
              <label className="panel-label">User ID</label>
              <input className="panel-input" readOnly value={session.id || 'demo'} />
            </div>
            <div className="panel-field">
              <label className="panel-label">Joined On</label>
              <input className="panel-input" readOnly value={session.createdAt || '—'} />
            </div>
          </div>

          {/* Save button */}
          <button className="panel-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
