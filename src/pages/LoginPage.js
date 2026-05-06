import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageLogo } from '../components/SharedComponents';

export default function LoginPage() {
  const { navigate, login } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', border: 'none', borderBottom: '1px solid #ddd',
    padding: '10px 0', fontSize: 14, fontFamily: 'Google Sans',
    outline: 'none', background: 'transparent', color: '#111',
    boxSizing: 'border-box',
  };

  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    login({ name: identifier, email: identifier });
  };

  const handleGoogleLogin = () => {
    login({ name: 'Google User', email: 'user@gmail.com', username: 'googleuser' });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      <div style={{ background: '#F5E642', padding: '52px 20px 30px', position: 'relative' }}>
        <PageLogo />
        <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Google Sans', color: '#111', marginTop: 8 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: '#555', fontFamily: 'Google Sans', marginTop: 4 }}>
          Sign in to your account
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px' }}>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Email or Username</label>
          <input
            value={identifier}
            onChange={e => { setIdentifier(e.target.value); setError(''); }}
            placeholder="Enter email or username"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter password"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
          <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Google Sans' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
        </div>

        <button onClick={handleGoogleLogin} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          border: '1.5px solid #ddd', borderRadius: 30, padding: '13px',
          background: 'white', fontFamily: 'Google Sans', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', marginBottom: 24, boxSizing: 'border-box',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {error && (
          <p style={{ fontSize: 12, color: '#FF4F6D', fontFamily: 'Google Sans', marginTop: 8 }}>{error}</p>
        )}

        <p style={{ fontSize: 13, color: '#555', fontFamily: 'Google Sans', marginTop: 28, textAlign: 'center' }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('register')}
            style={{ color: '#111', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create one
          </span>
        </p>
      </div>

      <div style={{ padding: '12px 20px 24px', background: 'white' }}>
        <button onClick={handleLogin} style={{
          width: '100%', background: '#111', color: 'white', border: 'none',
          borderRadius: 30, padding: '15px', fontSize: 15, fontWeight: 700,
          fontFamily: 'Google Sans', cursor: 'pointer',
        }}>Log In</button>
      </div>
    </div>
  );
}
