import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAB, DateTimePill, ProfileAvatar, PageLogo, MiniCalendarPopup } from '../components/SharedComponents';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPage() {
  const { activities, setViewingActivity, navigate } = useApp();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const getActivitiesForDay = (date) => {
    if (!date) return [];
    return activities.filter(a => new Date(a.date).toDateString() === date.toDateString());
  };

  const selectedActivities = getActivitiesForDay(selectedDay);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Header */}
      <div style={{ background: '#F4845F', padding: '52px 20px 16px', position: 'relative' }}>
        <PageLogo />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Google Sans', color: 'white' }}>Calendar</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <DateTimePill
                time={timeStr}
                monthYear={now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                onMonthYearClick={() => setShowCalendar(true)}
              />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Google Sans' }}>{dateStr}</span>
            </div>
          </div>
          <ProfileAvatar />
        </div>
      </div>

      {/* Month nav */}
      <div style={{ padding: '14px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setViewMonth(new Date(year, month - 1, 1))} style={{
          width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0',
          border: 'none', cursor: 'pointer', fontSize: 16,
        }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Google Sans' }}>{MONTHS[month]} {year}</span>
        <button onClick={() => setViewMonth(new Date(year, month + 1, 1))} style={{
          width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0',
          border: 'none', cursor: 'pointer', fontSize: 16,
        }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', gap: 0 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontFamily: 'Google Sans', color: '#000000', fontWeight: 600, paddingBottom: 6 }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', gap: '4px 0' }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const dayActivities = getActivitiesForDay(date);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDay?.toDateString();
          return (
            <button key={i} onClick={() => setSelectedDay(date)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '6px 2px', border: 'none', background: 'transparent', cursor: 'pointer',
              borderRadius: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isSelected ? '#111' : isToday ? '#c1c1c1' : 'transparent',
                fontSize: 13, fontFamily: 'Google Sans', fontWeight: isToday || isSelected ? 700 : 400,
                color: isSelected ? 'white' : '#111',
              }}>{date.getDate()}</div>
              <div style={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 28 }}>
                {dayActivities.slice(0, 3).map(a => (
                  <div key={a.id} style={{ width: 5, height: 5, borderRadius: '50%', background: a.color }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected day activities */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 90px', borderTop: '1px solid #f0f0f0', marginTop: 8 }}>
        {selectedDay && (
          <>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#555', fontFamily: 'Google Sans', marginBottom: 10 }}>
              {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            {selectedActivities.length === 0 ? (
              <p style={{ fontSize: 13, color: '#bbb', fontFamily: 'Google Sans' }}>No activities on this day.</p>
            ) : (
              selectedActivities.map(a => (
                <button key={a.id} onClick={() => { setViewingActivity(a); navigate('activitydetail', 'calendar'); }} style={{
                  width: '100%', background: a.color, borderRadius: 14, padding: '12px 14px',
                  border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 8,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: '#333', marginTop: 2, fontFamily: 'Google Sans' }}>{a.time} · {a.place}</div>
                  </div>
                  <span style={{ fontSize: 16 }}>{a.type === 'group' ? '👥' : '👤'}</span>
                </button>
              ))
            )}
          </>
        )}
      </div>

      <FAB />
      {showCalendar && (
        <MiniCalendarPopup
          selectedDate={selectedDay}
          onSelect={d => { setSelectedDay(d); setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setShowCalendar(false); }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
