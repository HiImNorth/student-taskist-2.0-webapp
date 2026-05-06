import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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

export function DateTimePill({ time, small, monthYear, onMonthYearClick }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {monthYear && (
        <button onClick={onMonthYearClick} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px',
          fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', color: 'inherit',
        }}>{monthYear}</button>
      )}
      <span style={{
        background: '#000000', color: 'white',
        borderRadius: 20, padding: small ? '2px 8px' : '3px 10px',
        fontSize: small ? 12 : 15, fontWeight: 700,
        fontFamily: 'Google Sans', display: 'inline-block',
      }}>{time || '12:00'}</span>
    </div>
  );
}

const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CAL_DAYS_HDR = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export function MiniCalendarPopup({ selectedDate, onSelect, onClose }) {
  const init = selectedDate ? new Date(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());
  const today = new Date();

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 24, padding: '20px 16px 24px', width: 'min(320px, calc(100vw - 40px))', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>‹</button>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>{CAL_MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
          {CAL_DAYS_HDR.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#aaa', fontFamily: 'Google Sans', fontWeight: 600, padding: '4px 0' }}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />;
            const date = new Date(viewYear, viewMonth, d);
            const isToday = date.toDateString() === today.toDateString();
            const isSel = selectedDate && date.toDateString() === new Date(selectedDate).toDateString();
            return (
              <button key={i} onClick={() => onSelect(date)} style={{
                aspectRatio: '1', borderRadius: '50%', border: 'none',
                background: isSel ? '#111' : isToday ? '#F5E642' : 'transparent',
                color: isSel ? 'white' : '#111',
                fontFamily: 'Google Sans', fontSize: 13,
                fontWeight: isSel || isToday ? 700 : 400,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{d}</button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
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
  const { currentUser } = useApp();
  const photo = currentUser?.profilePhoto;
  const letter = currentUser?.username
    ? currentUser.username[0].toUpperCase()
    : currentUser?.name
      ? currentUser.name[0].toUpperCase()
      : '?';

  if (photo) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <img src={photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'linear-gradient(135deg, #5B5FEF, #00C2C7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize: 14, fontFamily: 'Google Sans',
      flexShrink: 0,
    }}>{letter}</div>
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
