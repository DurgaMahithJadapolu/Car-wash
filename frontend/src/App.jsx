import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import Toolbar from './components/Toolbar';
import BookingTable from './components/BookingTable';
import BookingModal from './components/BookingModal';
import ProfilePanel from './components/ProfilePanel';
import SettingsPanel from './components/SettingsPanel';
import Toast from './components/Toast';
import { api } from './api/api';

// ── Session helpers ───────────────────────────
const SESSION_KEY = 'sw_session';
const TOKEN_KEY = 'sw_token';

const loadSession = () => {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) ||
      sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveSession = (user, persist) => {
  const s = JSON.stringify(user);
  if (persist) localStorage.setItem(SESSION_KEY, s);
  sessionStorage.setItem(SESSION_KEY, s);
};

const clearSession = () => {
  [localStorage, sessionStorage].forEach(s => {
    s.removeItem(SESSION_KEY);
    s.removeItem(TOKEN_KEY);
  });
};

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────
function App() {
  const [session, setSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStat, setFilterStat] = useState('');
  const [filterVtype, setFilterVtype] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState('');

  // ── Toast ──────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ── Restore session on mount ───────────────
  useEffect(() => {
    const existing = loadSession();
    const token =
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY);
    if (existing && token) {
      setSession(existing);
    }
  }, []);

  // ── Load bookings when logged in ───────────
  useEffect(() => {
    if (!session) return;
    api.getBookings()
      .then(setBookings)
      .catch(err => console.error('Failed to load bookings:', err));
  }, [session]);

  // ── Auth handlers ──────────────────────────
  const handleLogin = async ({ email, password, remember }) => {
    const data = await api.login({ email, password });
    if (remember) {
      localStorage.setItem(TOKEN_KEY, data.token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, data.token);
    }
    saveSession(data.user, remember);
    setSession(data.user);
    showToast(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
  };

  const handleSignup = async (formData) => {
    return api.signup(formData);
  };

  const handleDemoLogin = async () => {
    const data = await api.demoLogin();
    sessionStorage.setItem(TOKEN_KEY, data.token);
    saveSession(data.user, false);
    setSession(data.user);
    showToast('Demo mode — explore freely! 🚀');
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    clearSession();
    setSession(null);
    setBookings([]);
    showToast('Signed out. See you soon! 👋');
  };

  // ── Booking modal ──────────────────────────
  const openModal = (id = null) => {
    setEditId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const saveBooking = async (data) => {
    if (editId) {
      const updated = await api.updateBooking(editId, data);
      setBookings(prev => prev.map(b => b.id === editId ? updated : b));
      showToast('Booking updated!');
    } else {
      const created = await api.createBooking(data);
      setBookings(prev => [...prev, created]);
      showToast('Booking saved!');
    }
    closeModal();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await api.deleteBooking(id);
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast('Booking cancelled!');
  };

  const viewBooking = (b) => {
    showToast(`${b.name} | ${b.vnum || 'N/A'} | Notes: ${b.notes || 'None'}`);
  };

  // ── Profile / Settings ─────────────────────
  const handleProfileSave = async (data) => {
    const updated = await api.updateProfile(data);
    const newSession = { ...session, ...updated };
    const isPersisted = !!localStorage.getItem(TOKEN_KEY);
    saveSession(newSession, isPersisted);
    setSession(newSession);
    return updated;
  };

  const handlePasswordChange = async (data) => {
    return api.changePassword(data);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return;
    await api.deleteAccount();
    clearSession();
    setSession(null);
    setSettingsOpen(false);
    setBookings([]);
    showToast('Account deleted. Goodbye!');
  };

  // ── Filter bookings ────────────────────────
  const filtered = bookings.filter(b => {
    const haystack = (b.name + (b.vnum || '') + (b.vmod || '')).toLowerCase();
    const matchSearch = !search || haystack.includes(search.toLowerCase());
    const matchStat = !filterStat || b.stat === filterStat;
    const matchVtype = !filterVtype || b.vtype === filterVtype;
    return matchSearch && matchStat && matchVtype;
  });

  // ── Edit booking lookup ────────────────────
  const editingBooking = editId ? bookings.find(b => b.id === editId) : null;

  // ── Render ─────────────────────────────────
  if (!session) {
    return (
      <>
        <Auth
          onLogin={handleLogin}
          onSignup={handleSignup}
          onDemoLogin={handleDemoLogin}
        />
        <Toast message={toast} />
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <Header
        session={session}
        onNewBooking={() => openModal()}
        onProfile={() => setProfileOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="container">
        <StatsRow bookings={bookings} />
        <Toolbar
          search={search}
          onSearch={setSearch}
          filterStat={filterStat}
          onFilterStat={setFilterStat}
          filterVtype={filterVtype}
          onFilterVtype={setFilterVtype}
        />
        <BookingTable
          bookings={filtered}
          onEdit={openModal}
          onDelete={deleteBooking}
          onView={viewBooking}
        />
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={modalOpen}
        editId={editId}
        booking={editingBooking}
        onClose={closeModal}
        onSave={saveBooking}
      />

      {/* Profile Panel */}
      <ProfilePanel
        open={profileOpen}
        session={session}
        onClose={() => setProfileOpen(false)}
        onSave={handleProfileSave}
        onToast={showToast}
      />

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsOpen}
        session={session}
        onClose={() => setSettingsOpen(false)}
        onPasswordChange={handlePasswordChange}
        onDeleteAccount={handleDeleteAccount}
        onToast={showToast}
      />

      {/* Toast */}
      <Toast message={toast} />
    </>
  );
}

export default App;
