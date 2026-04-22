import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const TYPE_OPTIONS = ['focus', 'break', 'longbreak'];
const TYPE_LABELS = { focus: 'Focus', break: 'Break', longbreak: 'Long Break' };

export default function PomodoroEditPage() {
  const { navigate, pomodoroSessions, setPomodoroSessions } = useApp();
  const [sessions, setSessions] = useState(pomodoroSessions);
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState(25);
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
    setNewDuration(25);
  };

  const removeSession = (id) => setSessions(prev => prev.filter(s => s.id !== id));

  const handleSave = () => {
    setPomodoroSessions(sessions);
    navigate('pomodoro');
  };

  const inputStyle = {
    background: '#f5f5f5', border: 'none', borderRadius: 10,
    padding: '8px 12px', fontSize: 13, fontFamily: 'Google Sans', outline: 'none',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: '#F4845F', padding: '52px 20px 20px' }}>
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
            background: '#f9f9f9', borderRadius: 14, padding: '12px 14px',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: s.type === 'focus' ? '#111' : s.type === 'break' ? '#00C2C7' : '#5B5FEF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 10, fontFamily: 'Google Sans', fontWeight: 700, flexShrink: 0,
            }}>
              {s.type === 'focus' ? '●' : s.type === 'break' ? 'B' : 'LB'}
            </div>
            <input value={s.name} onChange={e => updateSession(s.id, 'name', e.target.value)}
              style={{ ...inputStyle, flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" value={s.duration} onChange={e => updateSession(s.id, 'duration', parseInt(e.target.value) || 1)}
                min="1" max="120" style={{ ...inputStyle, width: 56, textAlign: 'center' }} />
              <span style={{ fontSize: 11, color: '#777', fontFamily: 'Google Sans' }}>min</span>
            </div>
            <button onClick={() => removeSession(s.id)} style={{
              width: 28, height: 28, borderRadius: '50%', background: '#FF4F6D',
              border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, flexShrink: 0,
            }}>×</button>
          </div>
        ))}

        {/* Create new session */}
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#555', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Create Session</h2>
          <div style={{ background: '#f9f9f9', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Session name" style={{ ...inputStyle, width: '100%' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {TYPE_OPTIONS.map(t => (
                <button key={t} onClick={() => setNewType(t)} style={{
                  flex: 1, padding: '7px 0', borderRadius: 12,
                  background: newType === t ? '#111' : 'transparent',
                  border: '1.5px solid #ddd',
                  color: newType === t ? 'white' : '#555',
                  fontSize: 11, fontFamily: 'Google Sans', cursor: 'pointer',
                }}>{TYPE_LABELS[t]}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontFamily: 'Google Sans', color: '#555' }}>Duration:</span>
              <input type="number" value={newDuration} onChange={e => setNewDuration(parseInt(e.target.value) || 1)}
                min="1" max="120" style={{ ...inputStyle, width: 70, textAlign: 'center' }} />
              <span style={{ fontSize: 13, fontFamily: 'Google Sans', color: '#555' }}>minutes</span>
            </div>
            <button onClick={addSession} style={{
              background: '#111', color: 'white', border: 'none', borderRadius: 12,
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
