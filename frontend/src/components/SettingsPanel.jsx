import React, { useState, useEffect } from 'react';

const ini = (name) =>
  (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const pwStrength = (pw) => {
  if (!pw.length) return 0;
  if (pw.length < 4) return 1;
  if (pw.length < 6) return 2;
  if (pw.length < 10) return 3;
  return 4;
};

const PW_COLORS = ['#E5E3DC', '#D85A30', '#EF9F27', '#185FA5', '#1D9E75'];
const PW_LABELS = ['Enter new password', 'Too short', 'Weak', 'Good', 'Strong ✓'];

// ── Password field with toggle visibility ─────
const PwField = ({ className = 'panel-input', placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="pw-toggle" style={{ position: 'relative' }}>
      <input
        className={className}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ paddingRight: 42 }}
      />
      <span className="pw-eye" onClick={() => setShow(s => !s)}>
        {show ? '🙈' : '👁'}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// SettingsPanel
// ─────────────────────────────────────────────
const SettingsPanel = ({
  open,
  session,
  onClose,
  onPasswordChange,
  onDeleteAccount,
  onToast
}) => {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwStr, setPwStr] = useState(0);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      setPwStr(0);
      setMsg({ text: '', type: '' });
    }
  }, [open]);

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handlePasswordSave = async () => {
    if (!oldPw || !newPw || !confirmPw) {
      showMsg('All password fields are required', 'err');
      return;
    }
    if (newPw.length < 6) {
      showMsg('New password must be at least 6 characters', 'err');
      return;
    }
    if (newPw !== confirmPw) {
      showMsg('New passwords do not match!', 'err');
      return;
    }
    if (session?.id === 'demo') {
      showMsg('Demo users cannot change password', 'err');
      return;
    }

    setSaving(true);
    try {
      await onPasswordChange({
        oldPassword: oldPw,
        newPassword: newPw,
        confirmPassword: confirmPw
      });
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      setPwStr(0);
      showMsg('✓ Password changed successfully!', 'ok');
      onToast('Password updated! 🔐');
    } catch (err) {
      showMsg(err.message, 'err');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (session?.id === 'demo') {
      onToast('Demo accounts cannot be deleted');
      return;
    }
    try {
      await onDeleteAccount();
    } catch (err) {
      showMsg(err.message, 'err');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!session) return null;

  return (
    <div
      className={`panel-overlay${open ? ' open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="panel">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-title">⚙️ Account Settings</div>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="panel-body">
          {/* Avatar row */}
          <div className="panel-avatar-row">
            <div className="panel-av" style={{ background: '#1D9E75' }}>
              {ini(session.name)}
            </div>
            <div className="panel-av-info">
              <div className="pav-name">{session.name}</div>
              <div className="pav-email">{session.email}</div>
              <div className="pav-since">Member since {session.createdAt || '—'}</div>
            </div>
          </div>

          {/* Message */}
          {msg.text && (
            <div className={`panel-msg show ${msg.type}`}>{msg.text}</div>
          )}

          {/* Change Password */}
          <div className="panel-section">
            <div className="panel-section-title">🔑 Change Password</div>

            <div className="panel-field">
              <label className="panel-label">Current Password</label>
              <PwField
                placeholder="Enter current password"
                value={oldPw}
                onChange={e => setOldPw(e.target.value)}
              />
            </div>

            <div className="panel-field">
              <label className="panel-label">New Password</label>
              <PwField
                placeholder="Min 6 characters"
                value={newPw}
                onChange={e => {
                  setNewPw(e.target.value);
                  setPwStr(pwStrength(e.target.value));
                }}
              />
              <div
                className="pw-bar"
                style={{ width: `${pwStr * 25}%`, background: PW_COLORS[pwStr] }}
              />
              <div className="pw-lbl" style={{ color: PW_COLORS[pwStr] }}>
                {PW_LABELS[pwStr]}
              </div>
            </div>

            <div className="panel-field">
              <label className="panel-label">Confirm New Password</label>
              <PwField
                placeholder="Re-enter new password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
              />
            </div>

            <button
              className="panel-btn"
              onClick={handlePasswordSave}
              disabled={saving}
              style={{ marginBottom: 12 }}
            >
              {saving ? 'Updating...' : '🔑 Update Password'}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="panel-section">
            <div className="panel-section-title">🚫 Danger Zone</div>
            <button
              className="panel-btn panel-btn-danger"
              onClick={handleDeleteAccount}
            >
              🗑 Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
