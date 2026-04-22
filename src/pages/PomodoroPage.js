import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function PomodoroPage() {
  const { navigate, pomodoroSessions, activities } = useApp();
  const [mode, setMode] = useState('focus');
  const [running, setRunning] = useState(false);
  const [linkedActivity, setLinkedActivity] = useState(null);
  const [showLink, setShowLink] = useState(false);

  const session = pomodoroSessions.find(s => s.type === mode) || pomodoroSessions[0];
  const totalSeconds = (session?.duration || 30) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
  }, [mode, totalSeconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const progress = 1 - secondsLeft / totalSeconds;

  const modeConfig = {
    focus: { label: 'Focus', bg: '#111', text: 'white' },
    break: { label: 'Break', bg: '#00C2C7', text: 'white' },
    longbreak: { label: 'Long Break', bg: '#5B5FEF', text: 'white' },
  };
  const current = modeConfig[mode];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111', overflow: 'hidden' }}>
      {/* Mode selector */}
      <div style={{ padding: '60px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <h1 style={{ color: 'white', fontFamily: 'Google Sans', fontSize: 24, fontWeight: 700 }}>Pomodoro</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {Object.entries(modeConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setMode(key)} style={{
              padding: '8px 18px', borderRadius: 20,
              background: mode === key ? 'white' : 'transparent',
              border: '1.5px solid white',
              color: mode === key ? '#111' : 'white',
              fontFamily: 'Google Sans', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{cfg.label}</button>
          ))}
        </div>
      </div>

      {/* Timer circle */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width="220" height="220" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="110" cy="110" r="100" fill="none" stroke="#333" strokeWidth="8" />
            <circle cx="110" cy="110" r="100" fill="none" stroke="white" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 100}`}
              strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontSize: 11, fontFamily: 'Google Sans', opacity: 0.7, marginBottom: 4 }}>{current.label}</span>
            <span style={{ color: 'white', fontSize: 52, fontWeight: 700, fontFamily: 'Google Sans', letterSpacing: 2 }}>
              {mins}:{secs}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {running ? (
            <>
              <button onClick={() => setRunning(false)} style={{
                background: '#00C2C7', color: 'white', border: 'none',
                borderRadius: 24, padding: '12px 28px', fontSize: 15, fontWeight: 700,
                fontFamily: 'Google Sans', cursor: 'pointer',
              }}>Pause</button>
              <button onClick={() => { setRunning(false); setSecondsLeft(totalSeconds); }} style={{
                background: '#FF4F6D', color: 'white', border: 'none',
                borderRadius: 24, padding: '12px 28px', fontSize: 15, fontWeight: 700,
                fontFamily: 'Google Sans', cursor: 'pointer',
              }}>Reset</button>
            </>
          ) : (
            <button onClick={() => setRunning(true)} style={{
              background: 'white', color: '#111', border: 'none',
              borderRadius: 24, padding: '12px 40px', fontSize: 16, fontWeight: 700,
              fontFamily: 'Google Sans', cursor: 'pointer',
            }}>Start</button>
          )}
        </div>

        {/* Edit button */}
        <button onClick={() => navigate('pomodoro-edit', 'pomodoro')} style={{
          background: 'transparent', color: 'white', border: '1.5px solid #444',
          borderRadius: 20, padding: '7px 18px', fontSize: 13, fontFamily: 'Google Sans',
          cursor: 'pointer',
        }}>edit ✏️</button>

        {/* Link Activity */}
        <div style={{ width: '100%', padding: '0 20px' }}>
          <button onClick={() => setShowLink(!showLink)} style={{
            width: '100%', background: '#222', color: '#aaa', border: '1px solid #333',
            borderRadius: 14, padding: '10px 16px', fontSize: 13, fontFamily: 'Google Sans',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
          }}>
            <span>🔗 {linkedActivity ? linkedActivity.name : 'Link to activity...'}</span>
            <span style={{ fontSize: 10 }}>▼</span>
          </button>
          {showLink && (
            <div style={{
              background: '#1a1a1a', border: '1px solid #333', borderRadius: 12,
              marginTop: 4, overflow: 'hidden',
            }}>
              <button onClick={() => { setLinkedActivity(null); setShowLink(false); }} style={{
                display: 'block', width: '100%', padding: '10px 16px',
                background: 'none', border: 'none', color: '#aaa', fontFamily: 'Google Sans',
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
              }}>None</button>
              {activities.map(a => (
                <button key={a.id} onClick={() => { setLinkedActivity(a); setShowLink(false); }} style={{
                  display: 'block', width: '100%', padding: '10px 16px',
                  background: linkedActivity?.id === a.id ? '#333' : 'none',
                  border: 'none', color: 'white', fontFamily: 'Google Sans',
                  fontSize: 13, cursor: 'pointer', textAlign: 'left',
                  borderLeft: `3px solid ${a.color}`,
                }}>
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
