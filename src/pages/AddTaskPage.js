import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WeekStrip, PageLogo, MiniCalendarPopup } from '../components/SharedComponents';
import { MmSsInput } from './PomodoroEditPage';

const COLOR_OPTIONS = ['#F4845F','#FF4F6D','#C8F135','#00C2C7','#A8E6CF','#FFB3C6','#FFE566','#5B5FEF'];
const TYPE_OPTIONS = ['focus', 'break', 'longbreak'];
const TYPE_LABELS = { focus: 'Focus', break: 'Break', longbreak: 'Long Break' };

const TP_ITEM_H = 52;
const TP_HOURS = ['1','2','3','4','5','6','7','8','9','10','11','12'];
const TP_MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const TP_PERIODS = ['AM', 'PM'];

function parse24h(t) {
  const [h, m] = (t || '12:00').split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? '12' : String(h % 12);
  return { hour12, minute: String(m).padStart(2, '0'), period };
}

function to24h(hour12, minute, period) {
  let h = parseInt(hour12, 10);
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${minute}`;
}

function format12h(t) {
  const { hour12, minute, period } = parse24h(t);
  return `${hour12}:${minute} ${period}`;
}

function ScrollCol({ items, initIdx, onChange }) {
  const ref = useRef(null);
  const debounce = useRef(null);
  const [active, setActive] = useState(initIdx);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = initIdx * TP_ITEM_H;
  }, []);

  const onScroll = () => {
    if (!ref.current) return;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(ref.current.scrollTop / TP_ITEM_H)));
    setActive(idx);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => onChange(items[idx]), 120);
  };

  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <div ref={ref} onScroll={onScroll} className="tp-col" style={{
        height: TP_ITEM_H * 5, overflowY: 'scroll', scrollSnapType: 'y mandatory',
      }}>
        <div style={{ height: TP_ITEM_H * 2 }} />
        {items.map((item, i) => (
          <div key={item} style={{
            height: TP_ITEM_H, scrollSnapAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: i === active ? 24 : 18,
            fontWeight: i === active ? 700 : 400,
            color: i === active ? '#111' : '#c0c0c0',
            fontFamily: 'Google Sans', userSelect: 'none',
          }}>{item}</div>
        ))}
        <div style={{ height: TP_ITEM_H * 2 }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: TP_ITEM_H * 2, background: 'linear-gradient(to bottom, rgba(255,255,255,0.97) 20%, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: TP_ITEM_H * 2, background: 'linear-gradient(to top, rgba(255,255,255,0.97) 20%, transparent)', pointerEvents: 'none', zIndex: 2 }} />
    </div>
  );
}

function TimePickerSheet({ time, onChange, onClose }) {
  const { hour12, minute, period } = parse24h(time);
  const hRef = useRef(hour12);
  const mRef = useRef(minute);
  const pRef = useRef(period);
  const [display, setDisplay] = useState(time);

  const commit = (h, m, p) => {
    const t = to24h(h, m, p);
    setDisplay(t);
    onChange(t);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.2)' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '0 16px 36px', boxShadow: '0 -4px 32px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
        <style>{`.tp-col::-webkit-scrollbar{display:none}`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 4px 10px' }}>
          <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>Time</span>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#007AFF', background: '#EFF6FF', borderRadius: 20, padding: '4px 14px' }}>
            {format12h(display)}
          </span>
        </div>
        <div style={{ height: 1, background: '#f0f0f0', marginBottom: 0 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: TP_ITEM_H * 2, height: TP_ITEM_H, left: 4, right: 4, background: '#f2f2f2', borderRadius: 14, pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ display: 'flex', position: 'relative', zIndex: 2 }}>
            <ScrollCol items={TP_HOURS} initIdx={TP_HOURS.indexOf(hour12)} onChange={val => { hRef.current = val; commit(val, mRef.current, pRef.current); }} />
            <ScrollCol items={TP_MINUTES} initIdx={TP_MINUTES.indexOf(minute)} onChange={val => { mRef.current = val; commit(hRef.current, val, pRef.current); }} />
            <ScrollCol items={TP_PERIODS} initIdx={TP_PERIODS.indexOf(period)} onChange={val => { pRef.current = val; commit(hRef.current, mRef.current, val); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddTaskPage() {
  const {
    navigate, prevPage, addActivity, editingActivity, updateActivity, setEditingActivity,
    pomodoroSessions, setPomodoroSessions,
    setPomodoroLinkedActivity, setPomodoroCustomTotal, setPomodoroMode,
  } = useApp();
  const editing = editingActivity;

  const [name, setName] = useState(editing?.name || '');
  const [place, setPlace] = useState(editing?.place || '');
  const [note, setNote] = useState(editing?.note || '');
  const [type, setType] = useState(editing?.type || 'individual');
  const [color, setColor] = useState(editing?.color || '#F4845F');
  const [date, setDate] = useState(editing?.date ? new Date(editing.date) : new Date());
  const [time, setTime] = useState(editing?.time || '12:00');
  const [pomodoroEnabled, setPomodoroEnabled] = useState(editing?.pomodoroEnabled || false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const colorInputRef = useRef(null);

  // Session editor state (mirrors PomodoroEditPage)
  const [sessions, setSessions] = useState(pomodoroSessions);
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState(1500);
  const [newType, setNewType] = useState('focus');

  const updateSession = (id, field, value) =>
    setSessions(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  const addSession = () => {
    if (!newName.trim()) return;
    setSessions(prev => [...prev, { id: Date.now(), name: newName, duration: newDuration, type: newType }]);
    setNewName('');
    setNewDuration(1500);
  };
  const removeSession = (id) => setSessions(prev => prev.filter(s => s.id !== id));

  const inputStyle = {
    width: '100%', border: 'none', borderBottom: '1px solid #ddd',
    padding: '10px 0', fontSize: 14, fontFamily: 'Google Sans',
    outline: 'none', background: 'transparent', color: '#111',
  };
  const sessionInputStyle = {
    background: '#2a2a2a', border: '1px solid #444', borderRadius: 10,
    padding: '8px 12px', fontSize: 13, fontFamily: 'Google Sans', outline: 'none',
    color: 'white',
  };

  const openGoogleCalendar = () => {
    if (!name.trim()) return;
    const [h, m] = time.split(':').map(Number);
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    const fmt = d => {
      const p = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
    };
    const details = [note, type === 'group' ? '👥 Group Task' : '👤 Individual Task'].filter(Boolean).join('\n');
    const params = new URLSearchParams({ action: 'TEMPLATE', text: name, dates: `${fmt(start)}/${fmt(end)}`, details, location: place });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  };

  const buildActivity = () => ({ name, place, note, type, color, date, time, pomodoroEnabled });

  const handleSave = () => {
    if (!name.trim()) return;
    const activity = buildActivity();
    if (editing) {
      updateActivity(editing.id, activity);
      setEditingActivity(null);
    } else {
      addActivity(activity);
    }
    navigate(prevPage || 'home');
  };

  const handleLinkPomodoro = () => {
    if (!name.trim()) return;
    const activity = buildActivity();
    let linked;
    if (editing) {
      updateActivity(editing.id, activity);
      setEditingActivity(null);
      linked = { ...editing, ...activity };
    } else {
      const id = Date.now();
      addActivity({ ...activity, id });
      linked = { ...activity, id, completed: false };
    }
    setPomodoroSessions(sessions);
    setPomodoroLinkedActivity(linked);
    setPomodoroCustomTotal(null);
    setPomodoroMode('focus');
    navigate('pomodoro');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: '#F5E642', padding: '52px 20px 20px', position: 'relative' }}>
        <PageLogo />
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
          <button onClick={() => setShowCalendar(true)} style={{
            display: 'block', width: '100%', textAlign: 'center', marginBottom: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', color: '#555',
          }}>
            {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Date / Time</label>
            <button onClick={() => setShowTimePicker(true)} style={{
              border: 'none', background: '#00C2C7', color: 'white', borderRadius: 20,
              padding: '4px 14px', fontSize: 12, fontFamily: 'Google Sans', fontWeight: 700,
              cursor: 'pointer',
            }}>{format12h(time)}</button>
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

        {/* Pomodoro Session */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans', fontWeight: 600 }}>Pomodoro Session</label>
            <button onClick={() => setPomodoroEnabled(v => !v)} style={{
              background: pomodoroEnabled ? '#111' : 'transparent',
              border: '1.5px solid #111', borderRadius: 20,
              padding: '3px 14px', fontSize: 11, fontFamily: 'Google Sans',
              fontWeight: 600, color: pomodoroEnabled ? 'white' : '#111', cursor: 'pointer',
            }}>{pomodoroEnabled ? 'On' : 'Off'}</button>
          </div>

          {pomodoroEnabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Edit Sessions */}
              <h2 style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Google Sans', color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Edit Sessions</h2>
              {sessions.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                  background: '#1e1e1e', borderRadius: 14, padding: '12px 14px',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: s.type === 'focus' ? '#444' : s.type === 'break' ? '#00C2C7' : '#5B5FEF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 10, fontFamily: 'Google Sans', fontWeight: 700,
                  }}>
                    {s.type === 'focus' ? '●' : s.type === 'break' ? 'B' : 'LB'}
                  </div>
                  <input value={s.name} onChange={e => updateSession(s.id, 'name', e.target.value)}
                    style={{ ...sessionInputStyle, flex: 1 }} />
                  <MmSsInput dark totalSeconds={s.duration} onChange={val => updateSession(s.id, 'duration', val)} />
                  <button onClick={() => removeSession(s.id)} style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#FF4F6D',
                    border: 'none', color: 'white', cursor: 'pointer', fontSize: 14, flexShrink: 0,
                  }}>×</button>
                </div>
              ))}

              {/* Create Session */}
              <h2 style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Google Sans', color: '#555', margin: '14px 0 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Create Session</h2>
              <div style={{ background: '#1e1e1e', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Session name" style={{ ...sessionInputStyle, width: '100%' }} />
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

              {/* Link button */}
              <button onClick={handleLinkPomodoro} style={{
                marginTop: 12, background: '#F4845F', color: 'white', border: 'none', borderRadius: 12,
                padding: '12px', fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>🍅 Link &amp; Open Pomodoro</button>
            </div>
          )}
        </div>

        {/* Add to calendar */}
        <button onClick={openGoogleCalendar} style={{
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

      {showTimePicker && (
        <TimePickerSheet
          time={time}
          onChange={setTime}
          onClose={() => setShowTimePicker(false)}
        />
      )}
      {showCalendar && (
        <MiniCalendarPopup
          selectedDate={date}
          onSelect={d => { setDate(d); setShowCalendar(false); }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
