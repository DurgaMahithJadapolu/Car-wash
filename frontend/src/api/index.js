// ─────────────────────────────────────────────
// SparkleWash — API Client
// All HTTP calls to the Express backend
// ─────────────────────────────────────────────

const BASE = process.env.REACT_APP_API_URL || '/api';

const getToken = () =>
  localStorage.getItem('sw_token') || sessionStorage.getItem('sw_token');

const makeHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const api = {
  // ── Auth ──────────────────────────────────
  login: (body) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  signup: (body) =>
    fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  demoLogin: () =>
    fetch(`${BASE}/auth/demo`, {
      method: 'POST',
      headers: makeHeaders()
    }).then(handleResponse),

  logout: () =>
    fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: makeHeaders()
    }).then(handleResponse),

  // ── Bookings ──────────────────────────────
  getBookings: () =>
    fetch(`${BASE}/bookings`, { headers: makeHeaders() }).then(handleResponse),

  createBooking: (body) =>
    fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  updateBooking: (id, body) =>
    fetch(`${BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: makeHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  deleteBooking: (id) =>
    fetch(`${BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: makeHeaders()
    }).then(handleResponse),

  // ── Users ─────────────────────────────────
  getProfile: () =>
    fetch(`${BASE}/users/profile`, { headers: makeHeaders() }).then(handleResponse),

  updateProfile: (body) =>
    fetch(`${BASE}/users/profile`, {
      method: 'PUT',
      headers: makeHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  changePassword: (body) =>
    fetch(`${BASE}/users/password`, {
      method: 'PUT',
      headers: makeHeaders(),
      body: JSON.stringify(body)
    }).then(handleResponse),

  deleteAccount: () =>
    fetch(`${BASE}/users/account`, {
      method: 'DELETE',
      headers: makeHeaders()
    }).then(handleResponse)
};
