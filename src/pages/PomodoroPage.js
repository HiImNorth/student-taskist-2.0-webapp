import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageLogo } from '../components/SharedComponents';

function parseTimeInput(raw) {
  const s = raw.trim();
  if (s.includes(':')) {
    const [m, sec] = s.split(':').map(n => parseInt(n, 10) || 0);
    return Math.max(1, m * 60 + sec);
  }
  const n = parseInt(s, 10);
  return isNaN(n) ? null : Math.max(1, n * 60);
}

export default function PomodoroPage() {
  const {
    navigate, activities,
    pomodoroMode, setPomodoroMode,
    pomodoroRunning, setPomodoroRunning,
    pomodoroSecondsLeft, setPomodoroSecondsLeft,
    pomodoroTotalSeconds,
    setPomodoroCustomTotal,
    pomodoroLinkedActivity, setPomodoroLinkedActivity,
  } = useApp();

  const [showLink, setShowLink] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editInput, setEditInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const mins = String(Math.floor(pomodoroSecondsLeft / 60)).padStart(2, '0');
  const secs = String(pomodoroSecondsLeft % 60).padStart(2, '0');
  const progress = 1 - pomodoroSecondsLeft / pomodoroTotalSeconds;

  const modeConfig = {
    focus: { label: 'Focus' },
    break: { label: 'Break' },
    longbreak: { label: 'Long Break' },
  };
  const modeLabel = pomodoroMode === 'custom' ? 'Custom' : (modeConfig[pomodoroMode]?.label ?? '');

  const startEditing = () => {
    if (pomodoroRunning) return;
    setEditInput(`${mins}:${secs}`);
    setIsEditingTime(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    const total = parseTimeInput(editInput);
    if (total !== null) {
      setPomodoroCustomTotal(total);
      setPomodoroMode('custom');
      setPomodoroSecondsLeft(total);
    }
    setIsEditingTime(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setIsEditingTime(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <PageLogo invert />
      {/* Mode selector */}
      <div style={{ padding: '60px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <h1 style={{ color: 'white', fontFamily: 'Google Sans', fontSize: 24, fontWeight: 700 }}>Pomodoro</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          {Object.entries(modeConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => !isLoading && setPomodoroMode(key)} style={{
              padding: '8px 18px', borderRadius: 20,
              background: pomodoroMode === key ? 'white' : 'transparent',
              border: '1.5px solid white',
              color: pomodoroMode === key ? '#111' : 'white',
              fontFamily: 'Google Sans', fontSize: 13, fontWeight: 600, cursor: isLoading ? 'default' : 'pointer',
            }}>{cfg.label}</button>
          ))}
        </div>
      </div>

      {/* Timer circle */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width="220" height="220" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="110" cy="110" r="100" fill="none" stroke="#333" strokeWidth="8" />
            {!isLoading && (
              <circle cx="110" cy="110" r="100" fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            )}
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {isLoading ? (
              <>
                <div style={{
                  width: 56, height: 12, borderRadius: 6, background: '#555', marginBottom: 10,
                  animation: 'skeletonPulse 1.2s ease-in-out infinite',
                }} />
                <div style={{
                  width: 140, height: 56, borderRadius: 10, background: '#555',
                  animation: 'skeletonPulse 1.2s ease-in-out infinite',
                }} />
              </>
            ) : (
              <>
                <span style={{ color: 'white', fontSize: 11, fontFamily: 'Google Sans', opacity: 0.7, marginBottom: 4 }}>{modeLabel}</span>
                {isEditingTime ? (
                  <input
                    ref={inputRef}
                    value={editInput}
                    onChange={e => setEditInput(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    style={{
                      background: 'transparent', border: 'none', outline: 'none',
                      color: 'white', fontSize: 52, fontWeight: 700,
                      fontFamily: 'Google Sans', letterSpacing: 2,
                      width: 160, textAlign: 'center',
                    }}
                  />
                ) : (
                  <span
                    onClick={startEditing}
                    title="Click to set custom time"
                    style={{
                      color: 'white', fontSize: 52, fontWeight: 700,
                      fontFamily: 'Google Sans', letterSpacing: 2,
                      cursor: pomodoroRunning ? 'default' : 'text',
                    }}
                  >
                    {mins}:{secs}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {isLoading ? (
            <div style={{
              width: 120, height: 48, borderRadius: 24, background: '#555',
              animation: 'skeletonPulse 1.2s ease-in-out infinite',
            }} />
          ) : pomodoroRunning ? (
            <>
              <button onClick={() => setPomodoroRunning(false)} style={{
                background: '#00C2C7', color: 'white', border: 'none',
                borderRadius: 24, padding: '12px 28px', fontSize: 15, fontWeight: 700,
                fontFamily: 'Google Sans', cursor: 'pointer',
              }}>Pause</button>
              <button onClick={() => { setPomodoroRunning(false); setPomodoroSecondsLeft(pomodoroTotalSeconds); }} style={{
                background: '#FF4F6D', color: 'white', border: 'none',
                borderRadius: 24, padding: '12px 28px', fontSize: 15, fontWeight: 700,
                fontFamily: 'Google Sans', cursor: 'pointer',
              }}>Reset</button>
            </>
          ) : (
            <button onClick={() => setPomodoroRunning(true)} style={{
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
        <div style={{ width: '100%', padding: '0 20px', paddingBottom: 100 }}>
          <button onClick={() => setShowLink(!showLink)} style={{
            width: '100%', background: '#222', color: '#aaa', border: '1px solid #333',
            borderRadius: 14, padding: '10px 16px', fontSize: 13, fontFamily: 'Google Sans',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
          }}>
            <span>🔗 {pomodoroLinkedActivity ? pomodoroLinkedActivity.name : 'Link to activity...'}</span>
            <span style={{ fontSize: 10 }}>▼</span>
          </button>
          {showLink && (() => {
            const pomodoroActivities = activities.filter(a => a.pomodoroEnabled);
            return (
              <div style={{
                background: '#1a1a1a', border: '1px solid #333', borderRadius: 12,
                marginTop: 4, maxHeight: 220, overflowY: 'auto',
              }}>
                <button onClick={() => { setPomodoroLinkedActivity(null); setShowLink(false); }} style={{
                  display: 'block', width: '100%', padding: '10px 16px',
                  background: 'none', border: 'none', color: '#aaa', fontFamily: 'Google Sans',
                  fontSize: 13, cursor: 'pointer', textAlign: 'left',
                }}>None</button>
                {pomodoroActivities.length === 0 ? (
                  <div style={{ padding: '10px 16px', color: '#555', fontFamily: 'Google Sans', fontSize: 12 }}>
                    No activities with Pomodoro session
                  </div>
                ) : pomodoroActivities.map(a => (
                  <button key={a.id} onClick={() => { setPomodoroLinkedActivity(a); setShowLink(false); }} style={{
                    display: 'block', width: '100%', padding: '10px 16px',
                    background: pomodoroLinkedActivity?.id === a.id ? '#333' : 'none',
                    border: 'none', color: 'white', fontFamily: 'Google Sans',
                    fontSize: 13, cursor: 'pointer', textAlign: 'left',
                    borderLeft: `3px solid ${a.color}`,
                  }}>
                    {a.name}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
