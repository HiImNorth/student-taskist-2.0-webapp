import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageLogo } from '../components/SharedComponents';

const TYPE_OPTIONS = ['focus', 'break', 'longbreak'];
const TYPE_LABELS = { focus: 'Focus', break: 'Break', longbreak: 'Long Break' };

export function MmSsInput({ totalSeconds, onChange, dark }) {
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;

  const handleMm = (e) => {
    const val = Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
    onChange(val * 60 + ss);
  };

  const handleSs = (e) => {
    const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    onChange(mm * 60 + val);
  };

  const numStyle = {
    background: dark ? '#2a2a2a' : '#f5f5f5',
    border: dark ? '1px solid #444' : 'none',
    borderRadius: 10, padding: '8px 4px', fontSize: 13,
    fontFamily: 'Google Sans', outline: 'none', width: 44,
    textAlign: 'center', color: dark ? 'white' : '#111',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <input type="number" value={mm} onChange={handleMm} min="0" max="99" style={numStyle} />
      <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#aaa' : '#555', fontFamily: 'Google Sans' }}>:</span>
      <input type="number" value={String(ss).padStart(2, '0')} onChange={handleSs} min="0" max="59" style={numStyle} />
    </div>
  );
}

export default function PomodoroEditPage() {
  const { navigate, pomodoroSessions, setPomodoroSessions } = useApp();
  const [sessions, setSessions] = useState(pomodoroSessions);
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState(1500);
  const [newType, setNewType] = useState('focus');

  const updateSession = (id, field, value) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSession = () => {
    if (!newName.trim()) return;
    setSessions(prev => [...prev, {
      id: Date.now(), name: newName, duration: newDuration, type: newType
    }]);
    setNewName('');
    setNewDuration(1500);
  };

  const removeSession = (id) => setSessions(prev => prev.filter(s => s.id !== id));

  const handleSave = () => {
    setPomodoroSessions(sessions);
    navigate('pomodoro');
  };

  const inputStyle = {
    background: '#2a2a2a', border: '1px solid #444', borderRadius: 10,
    padding: '8px 12px', fontSize: 13, fontFamily: 'Google Sans', outline: 'none',
    color: 'white',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: '#F4845F', padding: '52px 20px 20px', position: 'relative' }}>
        <PageLogo />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('pomodoro')} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'white',
            border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700,
          }}>‹</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Google Sans', color: 'white' }}>Pomodoro</h1>
          <div style={{ width: 32 }} />
        </div>
      </div>

      {/* Sessions */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', paddingBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#555', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Edit Sessions</h2>
        {sessions.map(s => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            background: '#1e1e1e', borderRadius: 14, padding: '12px 14px',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: s.type === 'focus' ? '#444' : s.type === 'break' ? '#00C2C7' : '#5B5FEF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 10, fontFamily: 'Google Sans', fontWeight: 700, flexShrink: 0,
            }}>
              {s.type === 'focus' ? '●' : s.type === 'break' ? 'B' : 'LB'}
            </div>
            <input value={s.name} onChange={e => updateSession(s.id, 'name', e.target.value)}
              style={{ ...inputStyle, flex: 1 }} />
            <MmSsInput dark
              totalSeconds={s.duration}
              onChange={val => updateSession(s.id, 'duration', val)}
            />
            <button onClick={() => removeSession(s.id)} style={{
              width: 28, height: 28, borderRadius: '50%', background: '#FF4F6D',
              border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, flexShrink: 0,
            }}>×</button>
          </div>
        ))}

        {/* Create new session */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#555', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Create Session</h2>
          <div style={{ background: '#1e1e1e', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Session name" style={{ ...inputStyle, width: '100%' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {TYPE_OPTIONS.map(t => (
                <button key={t} onClick={() => setNewType(t)} style={{
                  flex: 1, padding: '7px 0', borderRadius: 12,
                  background: newType === t ? 'white' : 'transparent',
                  border: '1.5px solid #444',
                  color: newType === t ? '#111' : '#aaa',
                  fontSize: 11, fontFamily: 'Google Sans', cursor: 'pointer',
                }}>{TYPE_LABELS[t]}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontFamily: 'Google Sans', color: '#aaa' }}>Duration:</span>
              <MmSsInput dark totalSeconds={newDuration} onChange={setNewDuration} />
            </div>
            <button onClick={addSession} style={{
              background: '#333', color: 'white', border: 'none', borderRadius: 12,
              padding: '10px', fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', cursor: 'pointer',
            }}>+ Add Session</button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ padding: '12px 20px 24px' }}>
        <button onClick={handleSave} style={{
          width: '100%', background: '#111', color: 'white', border: 'none',
          borderRadius: 30, padding: '15px', fontSize: 15, fontWeight: 700,
          fontFamily: 'Google Sans', cursor: 'pointer',
        }}>Save</button>
      </div>
    </div>
  );
}
