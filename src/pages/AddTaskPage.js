import React, { useState } from 'react';
import { useApp, COLORS } from '../context/AppContext';
import { WeekStrip } from '../components/SharedComponents';

const COLOR_OPTIONS = ['#F4845F','#FF4F6D','#C8F135','#00C2C7','#A8E6CF','#FFB3C6','#FFE566','#5B5FEF'];

export default function AddTaskPage() {
  const { navigate, prevPage, addActivity, editingActivity, updateActivity, setEditingActivity } = useApp();
  const editing = editingActivity;

  const [name, setName] = useState(editing?.name || '');
  const [place, setPlace] = useState(editing?.place || '');
  const [note, setNote] = useState(editing?.note || '');
  const [type, setType] = useState(editing?.type || 'individual');
  const [color, setColor] = useState(editing?.color || '#F4845F');
  const [date, setDate] = useState(editing?.date ? new Date(editing.date) : new Date());
  const [time, setTime] = useState(editing?.time || '12:00');

  const inputStyle = {
    width: '100%', border: 'none', borderBottom: '1px solid #ddd',
    padding: '10px 0', fontSize: 14, fontFamily: 'Google Sans',
    outline: 'none', background: 'transparent', color: '#111',
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const activity = { name, place, note, type, color, date, time };
    if (editing) {
      updateActivity(editing.id, activity);
      setEditingActivity(null);
    } else {
      addActivity(activity);
    }
    navigate(prevPage || 'home');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: '#F5E642', padding: '52px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { setEditingActivity(null); navigate(prevPage || 'home'); }} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'white',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700,
          }}>‹</button>
          <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>
            {editing ? 'Edit Task' : 'ADD Task'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', paddingBottom: 30 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Task Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter task name" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Place</label>
          <input value={place} onChange={e => setPlace(e.target.value)} placeholder="Location or context" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Comment</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." style={inputStyle} />
        </div>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {['individual', 'group'].map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '8px 20px', borderRadius: 20, border: '1.5px solid #111',
              background: type === t ? '#111' : 'transparent',
              color: type === t ? 'white' : '#111',
              fontFamily: 'Google Sans', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              {t === 'individual' ? '👤 Individual' : '👥 Group'}
            </button>
          ))}
        </div>

        {/* Date & Time */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Date / Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{
              border: 'none', background: '#00C2C7', color: 'white', borderRadius: 20,
              padding: '3px 12px', fontSize: 12, fontFamily: 'Google Sans', fontWeight: 700,
              outline: 'none', cursor: 'pointer',
            }} />
          </div>
          <WeekStrip selectedDate={date} onSelect={setDate} />
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600, display: 'block', marginBottom: 10 }}>Color Label</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {COLOR_OPTIONS.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{
                width: 32, height: 32, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                boxShadow: color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                transition: 'box-shadow 0.15s',
              }} />
            ))}
          </div>
        </div>

        {/* Add to calendar */}
        <button style={{
          border: '1.5px solid #111', background: 'transparent', borderRadius: 20,
          padding: '8px 16px', fontSize: 13, fontFamily: 'Google Sans', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>📅 Add Calendar</button>
      </div>

      {/* Save button */}
      <div style={{ padding: '12px 20px 24px', background: 'white' }}>
        <button onClick={handleSave} style={{
          width: '100%', background: '#111', color: 'white', border: 'none',
          borderRadius: 30, padding: '15px', fontSize: 15, fontWeight: 700,
          fontFamily: 'Google Sans', cursor: 'pointer',
        }}>Save</button>
      </div>
    </div>
  );
}
