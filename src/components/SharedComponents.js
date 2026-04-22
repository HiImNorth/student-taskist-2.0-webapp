import React from 'react';
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

export function WeekStrip({ selectedDate, onSelect }) {
  const today = new Date();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });

  return (
    <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '4px 0' }}>
      {week.map((d, i) => {
        const isToday = d.toDateString() === today.toDateString();
        const isSelected = selectedDate && d.toDateString() === new Date(selectedDate).toDateString();
        return (
          <button key={i} onClick={() => onSelect && onSelect(d)} style={{
            flex: '0 0 auto', width: 38, padding: '6px 0',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: isSelected || isToday ? '#111' : 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 9, fontFamily: 'Google Sans', color: isSelected || isToday ? 'white' : '#000000' }}>{days[i]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', color: isSelected || isToday ? 'white' : '#111' }}>{d.getDate()}</span>
          </button>
        );
      })}
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
