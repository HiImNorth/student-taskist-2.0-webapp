import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageLogo } from '../components/SharedComponents';

const TOTAL_STEPS = 4;

export default function RegisterPage() {
  const { navigate, login } = useApp();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [tel, setTel] = useState('');
  const [countryCode, setCountryCode] = useState('+66');
  const [occupation, setOccupation] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [username, setUsername] = useState('');
  const [calendarLink, setCalendarLink] = useState('');

  const [verifyCode, setVerifyCode] = useState('');
  const [sentCode] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', border: 'none', borderBottom: '1px solid #ddd',
    padding: '10px 0', fontSize: 14, fontFamily: 'Google Sans',
    outline: 'none', background: 'transparent', color: '#111',
    boxSizing: 'border-box',
  };

  const labelStyle = { fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 };

  const stepTitles = ['Personal Info', 'Account', 'Profile', 'Verify Email'];

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!name.trim()) { setError('Full name is required.'); return; }
      if (!tel.trim()) { setError('Phone number is required.'); return; }
    } else if (step === 2) {
      if (!email.trim()) { setError('Email is required.'); return; }
      if (!password.trim()) { setError('Password is required.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    } else if (step === 3) {
      if (!username.trim()) { setError('Username is required.'); return; }
    } else if (step === 4) {
      if (verifyCode !== sentCode) { setError('Invalid verification code.'); return; }
      login({ name, email, username, tel: countryCode + tel, occupation, calendarLink, profilePhoto });
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    if (step === 1) { navigate('login'); return; }
    setStep(s => s - 1);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div style={{ background: '#F5E642', padding: '52px 20px 20px', position: 'relative' }}>
        <PageLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleBack} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'white',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0,
          }}>‹</button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>
              {stepTitles[step - 1]}
            </h1>
            <p style={{ fontSize: 11, color: '#555', fontFamily: 'Google Sans' }}>Step {step} of {TOTAL_STEPS}</p>
          </div>
        </div>
        <div style={{ marginTop: 14, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 4 }}>
          <div style={{
            height: '100%', width: `${(step / TOTAL_STEPS) * 100}%`,
            background: '#111', borderRadius: 4, transition: 'width 0.3s',
          }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>

        {step === 1 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ position: 'relative', width: 88, height: 88 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: '#f0f0f0', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #ddd',
                }}>
                  {profilePhoto
                    ? <img src={profilePhoto} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : name.trim()
                      ? <span style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Google Sans', color: '#555', lineHeight: 1 }}>
                          {name.trim()[0].toUpperCase()}
                        </span>
                      : <svg width="40" height="40" viewBox="0 0 24 24" fill="#bbb"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  }
                </div>
                <label style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#111', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', border: '2px solid white',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) setProfilePhoto(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
              <p style={{ fontSize: 11, color: '#888', fontFamily: 'Google Sans', marginTop: 8 }}>Profile Photo</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name *</label>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                placeholder="Enter your full name"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'light' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Phone Number *</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <input
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  placeholder="+66"
                  style={{ ...inputStyle, width: 64, flexShrink: 0 }}
                />
                <input
                  value={tel}
                  onChange={e => { setTel(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="812345678"
                  inputMode="numeric"
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Occupation</label>
              <input
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                placeholder="e.g. Student, Designer, Developer"
                style={inputStyle}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="Enter your email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password *</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Create a password"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Re-enter your password"
                style={inputStyle}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Username *</label>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value.replace(/\s/g, '')); setError(''); }}
                placeholder="Choose a username"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: '#aaa', fontFamily: 'Google Sans', marginTop: 6 }}>
                No spaces allowed.
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Calendar Link (optional)</label>
              <input
                value={calendarLink}
                onChange={e => setCalendarLink(e.target.value)}
                placeholder="Paste your Google Calendar or iCal link"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: '#aaa', fontFamily: 'Google Sans', marginTop: 6 }}>
                Link a calendar to sync your tasks automatically.
              </p>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div style={{
              background: '#f8f8f8', borderRadius: 16, padding: '18px 20px',
              marginBottom: 28, textAlign: 'center',
            }}>
              <p style={{ fontSize: 13, color: '#555', fontFamily: 'Google Sans', marginBottom: 4 }}>
                A verification code was sent to
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>{email}</p>
              <p style={{ fontSize: 11, color: '#aaa', fontFamily: 'Google Sans', marginTop: 10 }}>
                Demo code: <strong style={{ color: '#111', letterSpacing: 2 }}>{sentCode}</strong>
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Verification Code</label>
              <input
                value={verifyCode}
                onChange={e => { setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                placeholder="------"
                inputMode="numeric"
                maxLength={6}
                style={{
                  ...inputStyle,
                  fontSize: 28, fontWeight: 700, letterSpacing: 10,
                  textAlign: 'center', paddingTop: 14, paddingBottom: 14,
                }}
              />
            </div>
          </>
        )}

        {error && (
          <p style={{ fontSize: 12, color: '#FF4F6D', fontFamily: 'Google Sans', marginTop: 4 }}>{error}</p>
        )}
      </div>

      <div style={{ padding: '12px 20px 24px', background: 'white' }}>
        <button onClick={handleNext} style={{
          width: '100%', background: '#111', color: 'white', border: 'none',
          borderRadius: 30, padding: '15px', fontSize: 15, fontWeight: 700,
          fontFamily: 'Google Sans', cursor: 'pointer',
        }}>
          {step === TOTAL_STEPS ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
