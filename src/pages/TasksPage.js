import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAB, DateTimePill, WeekStrip, ProfileAvatar, ColorDot, PageLogo, MiniCalendarPopup } from '../components/SharedComponents';

export default function TasksPage({ mode = 'individual' }) {
  const { activities, toggleComplete, setViewingActivity, navigate } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterComplete, setFilterComplete] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const isGroup = mode === 'groups';
  const headerBg = isGroup ? '#5B5FEF' : '#05d5dc';
  const title = isGroup ? 'Group Work' : 'My Task';

  const filtered = activities.filter(a => {
    const matchType = isGroup ? a.type === 'group' : a.type === 'individual';
    const matchDate = new Date(a.date).toDateString() === selectedDate.toDateString();
    const matchComplete = filterComplete === 'all' ? true : filterComplete === 'done' ? a.completed : !a.completed;
    return matchType && matchDate && matchComplete;
  });

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: headerBg, padding: '52px 20px 16px', position: 'relative' }}>
        <PageLogo />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Google Sans', color: 'white' }}>{title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <DateTimePill time={timeStr} />
              <button onClick={() => setShowCalendar(true)} style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Google Sans', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{dateStr}</button>
            </div>
          </div>
          <ProfileAvatar />
        </div>
        <div style={{ marginTop: 12 }}>
          <WeekStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{
            border: '1.5px solid #ddd', background: 'white', borderRadius: 20,
            padding: '5px 14px', fontSize: 12, fontFamily: 'Google Sans', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>Filter ▼</button>
          {showFilter && (
            <div style={{
              position: 'absolute', right: 0, top: 36, background: 'white',
              border: '1px solid #eee', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              zIndex: 50, minWidth: 140, overflow: 'hidden',
            }}>
              {[['all', 'All'], ['done', 'Completed'], ['notdone', 'Not Complete']].map(([val, label]) => (
                <button key={val} onClick={() => { setFilterComplete(val); setShowFilter(false); }} style={{
                  display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left',
                  background: filterComplete === val ? '#f5f5f5' : 'white',
                  border: 'none', fontFamily: 'Google Sans', fontSize: 13, cursor: 'pointer',
                  fontWeight: filterComplete === val ? 700 : 400,
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 90px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', fontFamily: 'Google Sans', fontSize: 14, paddingTop: 40 }}>
            No activities found.
          </div>
        ) : (
          filtered.map(a => (
            <div key={a.id} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              {/* Time column */}
              <div style={{ width: 40, flexShrink: 0, paddingTop: 10 }}>
                <div style={{ fontSize: 11, fontFamily: 'Google Sans', color: '#555', fontWeight: 600 }}>{a.time}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 12 }}>{a.type === 'group' ? '👥' : '👤'}</span>
                </div>
              </div>
              {/* Checkbox */}
              <div style={{ paddingTop: 12, flexShrink: 0 }}>
                <input type="checkbox" checked={a.completed} onChange={() => toggleComplete(a.id)}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#111' }} />
              </div>
              {/* Card */}
              <button onClick={() => { setViewingActivity(a); navigate('activitydetail', isGroup ? 'groups' : 'tasks'); }} style={{
                flex: 1, background: a.color, borderRadius: 14, padding: '12px 14px',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                opacity: a.completed ? 0.6 : 1, transition: 'transform 0.15s',
                textDecoration: a.completed ? 'line-through' : 'none',
              }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>{a.name}</div>
                <div style={{ fontSize: 12, color: '#333', marginTop: 3, fontFamily: 'Google Sans' }}>{a.place}</div>
              </button>
            </div>
          ))
        )}
      </div>

      <FAB />
      {showCalendar && (
        <MiniCalendarPopup
          selectedDate={selectedDate}
          onSelect={d => { setSelectedDate(d); setShowCalendar(false); }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
