import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function FAB() {
  const { navigate, page } = useApp();
  return (
    <button
      onClick={() => navigate('addtask', page)}
      style={{
        position: 'absolute', bottom: 110, right: 20,
        width: 52, height: 52, borderRadius: '50%',
        background: '#F5E642', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        fontSize: 28, fontWeight: 300, color: '#111',
        zIndex: 99, transition: 'transform 0.15s',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >+</button>
  );
}

export function DateTimePill({ time, small }) {
  return (
    <span style={{
      background: '#000000', color: 'white',
      borderRadius: 20, padding: small ? '2px 8px' : '3px 10px',
      fontSize: small ? 12 : 15, fontWeight: 700,
      fontFamily: 'Google Sans', display: 'inline-block',
    }}>{time || '12:00'}</span>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMonday(d) {
  const day = new Date(d);
  const dow = day.getDay();
  day.setDate(day.getDate() - (dow === 0 ? 6 : dow - 1));
  day.setHours(0, 0, 0, 0);
  return day;
}

export function WeekStrip({ selectedDate, onSelect }) {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);

  const monday = getMonday(today);
  monday.setDate(monday.getDate() + weekOffset * 7);

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const isCurrentWeek = weekOffset === 0;

  const arrowBtn = {
    width: 28, height: 28, flexShrink: 0, borderRadius: '50%',
    background: 'transparent', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, fontWeight: 700, color: '#111', fontFamily: 'Google Sans',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button style={arrowBtn} onClick={() => setWeekOffset(w => w - 1)}>‹</button>
        <div style={{ flex: 1, display: 'flex', gap: 3 }}>
          {week.map((d, i) => {
            const isToday = d.toDateString() === today.toDateString();
            const isSelected = selectedDate && d.toDateString() === new Date(selectedDate).toDateString();
            const bg = isSelected ? '#111' : isToday ? '#bbb' : 'transparent';
            const textColor = isSelected ? 'white' : '#111';
            return (
              <button key={i} onClick={() => onSelect && onSelect(d)} style={{
                flex: 1, padding: '6px 0', borderRadius: 10, border: 'none',
                cursor: 'pointer', background: bg,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}>
                <span style={{ fontSize: 9, fontFamily: 'Google Sans', color: textColor }}>{DAYS[i]}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', color: textColor }}>{d.getDate()}</span>
              </button>
            );
          })}
        </div>
        <button style={arrowBtn} onClick={() => setWeekOffset(w => w + 1)}>›</button>
      </div>
      {!isCurrentWeek && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <button onClick={() => setWeekOffset(0)} style={{
            background: 'rgba(0,0,0,0.15)', border: 'none', borderRadius: 12,
            padding: '3px 14px', fontSize: 11, fontFamily: 'Google Sans',
            fontWeight: 600, color: '#111', cursor: 'pointer',
          }}>Today</button>
        </div>
      )}
    </div>
  );
}

export function ProfileAvatar() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'linear-gradient(135deg, #5B5FEF, #00C2C7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: 14, fontFamily: 'Google Sans',
      flexShrink: 0,
    }}>U</div>
  );
}

export function PageLogo({ invert = false }) {
  return (
    <img
      src="/Logo.svg"
      alt="Logo"
      style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        height: 26, pointerEvents: 'none',
        filter: invert ? 'invert(1)' : 'none',
      }}
    />
  );
}

export function ColorDot({ color, size = 12 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />;
}

export function TypeBadge({ type }) {
  return (
    <span style={{
      background: type === 'individual' ? '#111' : 'transparent',
      border: type === 'group' ? '1.5px solid #111' : 'none',
      color: type === 'individual' ? 'white' : '#111',
      borderRadius: 20, padding: '3px 10px', fontSize: 11,
      fontFamily: 'Google Sans', fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {type === 'individual' ? '👤' : '👥'} {type === 'individual' ? 'Individual' : 'Group'}
    </span>
  );
}
