import React, { useState } from 'react';

// ── Password strength helper ──────────────────
const pwStrength = (pw) => {
  if (!pw.length) return 0;
  if (pw.length < 4) return 1;
  if (pw.length < 6) return 2;
  if (pw.length < 10) return 3;
  return 4;
};

const PW_COLORS = ['#E5E3DC', '#D85A30', '#EF9F27', '#185FA5', '#1D9E75'];
const PW_LABELS = ['Enter a password', 'Too short — keep going', 'Weak password', 'Good password', 'Strong password ✓'];

// ── PW Toggle field ───────────────────────────
const PwField = ({ id, className = 'a-input', placeholder, value, onChange, onInput }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="pw-toggle">
      <input
        className={className}
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInput={onInput}
        required
        style={{ paddingRight: 42 }}
      />
      <span className="pw-eye" onClick={() => setShow(s => !s)}>
        {show ? '🙈' : '👁'}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Auth Component
// ─────────────────────────────────────────────
const Auth = ({ onLogin, onSignup, onDemoLogin }) => {
  const [tab, setTab] = useState('login');

  // Login state
  const [lEmail, setLEmail] = useState('');
  const [lPass, setLPass] = useState('');
  const [lRemember, setLRemember] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [loginErrStyle, setLoginErrStyle] = useState({});

  // Signup state
  const [sFn, setSFn] = useState('');
  const [sLn, setSLn] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sPass, setSPass] = useState('');
  const [sPass2, setSPass2] = useState('');
  const [sTerms, setSTerms] = useState(false);
  const [signupErr, setSignupErr] = useState('');
  const [signupOk, setSignupOk] = useState('');
  const [pwStr, setPwStr] = useState(0);

  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const switchTab = (t) => {
    setTab(t);
    setLoginErr('');
    setSignupErr('');
    setSignupOk('');
  };

  // ── Login ──────────────────────────────────
  const doLogin = async (e) => {
    e.preventDefault();
    setLoginErr('');
    setLoginErrStyle({});
    try {
      await onLogin({ email: lEmail, password: lPass, remember: lRemember });
    } catch (err) {
      setLoginErr(err.message);
    }
  };

  const showForgot = () => {
    if (!lEmail.trim()) {
      setLoginErr('ℹ Enter your email address first');
      return;
    }
    setLoginErrStyle({ background: '#EAF3DE', color: '#3B6D11', borderColor: '#C0DD97' });
    setLoginErr(`ℹ Password hint: Use the credentials from your signup. This is a local app.`);
  };

  // ── Signup ─────────────────────────────────
  const doSignup = async (e) => {
    e.preventDefault();
    setSignupErr('');
    setSignupOk('');

    if (sPass.length < 6) { setSignupErr('Password must be at least 6 characters'); return; }
    if (sPass !== sPass2) { setSignupErr('Passwords do not match!'); return; }
    if (!sTerms) { setSignupErr('Please accept the Terms & Privacy Policy'); return; }

    try {
      await onSignup({ firstName: sFn, lastName: sLn, email: sEmail, phone: sPhone, password: sPass });
      setSignupOk('✓ Account created successfully! Signing you in...');
      setSFn(''); setSLn(''); setSEmail(''); setSPhone(''); setSPass(''); setSPass2('');
      setTimeout(() => {
        setTab('login');
        setLEmail(sEmail);
        setSignupOk('');
      }, 1600);
    } catch (err) {
      setSignupErr(err.message);
    }
  };

  // ── Demo Login ─────────────────────────────
  const demoLogin = async () => {
    try { await onDemoLogin(); }
    catch (err) { showToast(err.message); }
  };

  const handlePwInput = (val) => {
    setSPass(val);
    setPwStr(pwStrength(val));
  };

  return (
    <>
      <div className="auth-screen">
        <div className="auth-card">
          {/* Top banner */}
          <div className="auth-top">
            <div className="auth-logo">🚗</div>
            <div className="auth-site-name">SparkleWash</div>
            <div className="auth-tagline">Your smart management platform</div>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === 'login' ? ' active' : ''}`}
              onClick={() => switchTab('login')}
            >
              🔒 Sign In
            </button>
            <button
              className={`auth-tab${tab === 'signup' ? ' active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              ✏️ Sign Up
            </button>
          </div>

          <div className="auth-body">
            {/* ── LOGIN FORM ── */}
            <form
              className={`auth-form${tab === 'login' ? ' active' : ''}`}
              onSubmit={doLogin}
            >
              {loginErr && (
                <div className="a-err show" style={loginErrStyle}>
                  {loginErr}
                </div>
              )}
              <div className="a-field">
                <label className="a-label">Email Address</label>
                <input
                  className="a-input"
                  type="email"
                  placeholder="you@example.com"
                  value={lEmail}
                  onChange={e => setLEmail(e.target.value)}
                  required
                />
              </div>
              <div className="a-field">
                <label className="a-label">Password</label>
                <input
                  className="a-input"
                  type="password"
                  placeholder="Enter your password"
                  value={lPass}
                  onChange={e => setLPass(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#6B6A64' }}>
                  <input
                    type="checkbox"
                    style={{ accentColor: '#1D9E75' }}
                    checked={lRemember}
                    onChange={e => setLRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <span className="a-link" onClick={showForgot} style={{ fontSize: 12 }}>
                  Forgot password?
                </span>
              </div>
              <button type="submit" className="a-btn">Sign In →</button>
              <div className="a-divider">or</div>
              <div className="a-social">
                <button type="button" className="a-social-btn" onClick={demoLogin}>
                  👤 Demo Login
                </button>
                <button type="button" className="a-social-btn" onClick={() => switchTab('signup')}>
                  ✏️ Register
                </button>
              </div>
            </form>

            {/* ── SIGNUP FORM ── */}
            <form
              className={`auth-form${tab === 'signup' ? ' active' : ''}`}
              onSubmit={doSignup}
            >
              {signupErr && <div className="a-err show">{signupErr}</div>}
              {signupOk && <div className="a-succ show">{signupOk}</div>}

              <div className="a-row">
                <div className="a-field">
                  <label className="a-label">First Name</label>
                  <input className="a-input" placeholder="Raj" value={sFn} onChange={e => setSFn(e.target.value)} required />
                </div>
                <div className="a-field">
                  <label className="a-label">Last Name</label>
                  <input className="a-input" placeholder="Kumar" value={sLn} onChange={e => setSLn(e.target.value)} />
                </div>
              </div>
              <div className="a-field">
                <label className="a-label">Email Address</label>
                <input className="a-input" type="email" placeholder="you@example.com" value={sEmail} onChange={e => setSEmail(e.target.value)} required />
              </div>
              <div className="a-field">
                <label className="a-label">Phone Number</label>
                <input className="a-input" type="tel" placeholder="+91 XXXXX XXXXX" value={sPhone} onChange={e => setSPhone(e.target.value)} />
              </div>
              <div className="a-field">
                <label className="a-label">Password</label>
                <PwField
                  id="s-pass"
                  placeholder="Min 6 characters"
                  value={sPass}
                  onChange={e => handlePwInput(e.target.value)}
                />
                <div
                  className="pw-bar"
                  style={{ width: `${pwStr * 25}%`, background: PW_COLORS[pwStr] }}
                />
                <div className="pw-lbl" style={{ color: PW_COLORS[pwStr] }}>
                  {PW_LABELS[pwStr]}
                </div>
              </div>
              <div className="a-field">
                <label className="a-label">Confirm Password</label>
                <PwField
                  id="s-pass2"
                  placeholder="Re-enter password"
                  value={sPass2}
                  onChange={e => setSPass2(e.target.value)}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 7, cursor: 'pointer', fontSize: 12, color: '#6B6A64', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  style={{ accentColor: '#1D9E75', marginTop: 2 }}
                  checked={sTerms}
                  onChange={e => setSTerms(e.target.checked)}
                />
                I agree to the <span className="a-link">Terms &amp; Privacy Policy</span>
              </label>
              <button type="submit" className="a-btn">Create Account →</button>
              <p className="a-footer-txt">
                Already have an account?{' '}
                <span className="a-link" onClick={() => switchTab('login')}>Sign in</span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Auth Toast */}
      <div className={`auth-toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  );
};

export default Auth;
