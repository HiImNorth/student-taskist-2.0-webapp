import React from 'react';
import { useApp } from '../context/AppContext';

export default function PomodoroCompleteModal() {
  const {
    pomodoroFinished, setPomodoroFinished,
    pomodoroFinishedMode,
    pomodoroSessions,
    setPomodoroMode,
    setPomodoroSecondsLeft,
    setPomodoroRunning,
    setPomodoroCustomTotal,
    navigate,
  } = useApp();

  if (!pomodoroFinished) return null;

  const isCustom = pomodoroFinishedMode === 'custom';
  const isFocus = pomodoroFinishedMode === 'focus';

  const getPreset = (type) => {
    const s = pomodoroSessions.find(s => s.type === type);
    return s ? s.duration : (type === 'focus' ? 1800 : type === 'break' ? 300 : 600);
  };

  const fmt = (secs) => {
    const m = Math.floor(secs / 60), s = secs % 60;
    return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, '0')}`;
  };

  const startSession = (type) => {
    const totalSeconds = getPreset(type);
    setPomodoroCustomTotal(null);
    setPomodoroMode(type);
    setPomodoroSecondsLeft(totalSeconds);
    setPomodoroRunning(true);
    setPomodoroFinished(false);
  };

  const handleDone = () => setPomodoroFinished(false);

  const handleGoToPomodoro = () => {
    setPomodoroFinished(false);
    navigate('pomodoro');
  };

  const btnBase = {
    width: '100%', border: 'none', borderRadius: 30,
    padding: '15px', fontSize: 15, fontWeight: 700,
    fontFamily: 'Google Sans', cursor: 'pointer',
  };

  const icon = isCustom ? '⏰' : isFocus ? '☕' : '🎯';
  const title = isCustom ? 'Timer done!' : isFocus ? 'Focus session done!' : 'Break time is over!';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
    }}>
      <div style={{
        background: '#111', borderRadius: 24, padding: '32px 28px',
        width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#222',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, marginBottom: 4,
        }}>
          {icon}
        </div>

        <p style={{
          color: 'white', fontFamily: 'Google Sans', fontSize: 16,
          fontWeight: 700, textAlign: 'center', margin: 0,
        }}>
          {title}
        </p>

        <p style={{
          color: '#aaa', fontFamily: 'Google Sans', fontSize: 13,
          textAlign: 'center', margin: '0 0 8px',
        }}>
          {isCustom ? 'What would you like to do next?' : 'Do you want to continue the session?'}
        </p>

        {isCustom ? (
          <button onClick={handleGoToPomodoro} style={{
            ...btnBase, background: 'white', color: '#111',
          }}>
            Go to Pomodoro
          </button>
        ) : isFocus ? (
          <>
            <button onClick={() => startSession('break')} style={{
              ...btnBase, background: 'white', color: '#111',
            }}>
              Short Break — {fmt(getPreset('break'))}
            </button>
            <button onClick={() => startSession('longbreak')} style={{
              ...btnBase, background: 'white', color: '#111',
            }}>
              Long Break — {fmt(getPreset('longbreak'))}
            </button>
          </>
        ) : (
          <button onClick={() => startSession('focus')} style={{
            ...btnBase, background: 'white', color: '#111',
          }}>
            Continue — Focus {fmt(getPreset('focus'))}
          </button>
        )}

        <button onClick={handleDone} style={{
          ...btnBase, background: '#FF4F6D', color: 'white', marginTop: 4,
        }}>
          Done
        </button>
      </div>
    </div>
  );
}
