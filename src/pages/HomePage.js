import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FAB, DateTimePill, ProfileAvatar } from '../components/SharedComponents';

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatClock(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function HomePage() {
  const { todayActivities, navigate, setViewingActivity, toggleComplete } = useApp();
  const [now, setNow] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const incomplete = todayActivities.filter(a => !a.completed);
  const completed = todayActivities.filter(a => a.completed);
  const groupTasks = todayActivities.filter(a => a.type === 'group');
  const completedCount = todayActivities.filter(a => a.completed).length;
  const pct = todayActivities.length ? Math.round((completedCount / todayActivities.length) * 100) : 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Google Sans', color: '#111', lineHeight: 1 }}>Home</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <DateTimePill time={formatClock(now)} />
              <span style={{ fontSize: 12, color: '#555', fontFamily: 'Google Sans' }}>{formatDate(now)}</span>
            </div>
          </div>
          <ProfileAvatar />
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, background: '#f5f5f5', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>{incomplete.length}</span>
            <div>
              <div style={{ fontSize: 12, fontFamily: 'Google Sans', color: '#555', lineHeight: 1.3 }}>Incomplete<br/>Task</div>
              <span style={{ fontSize: 16 }}>👤</span>
            </div>
          </div>
          <div style={{ flex: 1, background: '#f5f5f5', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Google Sans', color: '#111' }}>{groupTasks.length}</span>
            <div>
              <div style={{ fontSize: 12, fontFamily: 'Google Sans', color: '#555', lineHeight: 1.3 }}>Group<br/>Task</div>
              <span style={{ fontSize: 16 }}>👥</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontFamily: 'Google Sans', color: '#555' }}>Today's Progress</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Google Sans' }}>{pct}%</span>
          </div>
          <div style={{ background: '#eee', borderRadius: 10, height: 8 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#C8F135', borderRadius: 10, transition: 'width 0.5s' }} />
          </div>
        </div>
      </div>

      {/* Today Events */}
      <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Google Sans', marginBottom: 12, color: '#111' }}>Today Events</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {incomplete.map(activity => (
            <div key={activity.id} style={{ position: 'relative' }}>
              <button onClick={() => { setViewingActivity(activity); navigate('activitydetail', 'home'); }} style={{
                background: activity.color, borderRadius: 16, padding: '14px', border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'transform 0.15s',
              }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', color: '#111', lineHeight: 1.3 }}>{activity.name}</span>
                  <span style={{ fontSize: 14 }}>{activity.type === 'group' ? '👥' : '👤'}</span>
                </div>
                <div style={{ fontSize: 11, color: '#333', marginTop: 4, fontFamily: 'Google Sans' }}>{activity.place}</div>
                <div style={{ fontSize: 10, color: '#444', marginTop: 6, fontFamily: 'Google Sans' }}>{activity.time}</div>
              </button>
              <input 
                type="checkbox" 
                checked={activity.completed}
                onChange={(e) => { e.stopPropagation(); toggleComplete(activity.id); }}
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 16,
                  height: 16,
                  cursor: 'pointer',
                  accentColor: '#111'
                }}
              />
            </div>
          ))}
        </div>
        {incomplete.length === 0 && completed.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', fontFamily: 'Google Sans', fontSize: 14, paddingTop: 40 }}>
            No activities today.<br/>Tap + to add one!
          </div>
        )}

        {/* Completed Tasks Dropdown */}
        {completed.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button 
              onClick={() => setShowCompleted(!showCompleted)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: 16,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'Google Sans',
                fontSize: 14,
                fontWeight: 600,
                color: '#111',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#efefef'}
              onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
            >
              <span>✓ Completed ({completed.length})</span>
              <span style={{ fontSize: 12, transform: showCompleted ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
            </button>

            {showCompleted && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                {completed.map(activity => (
                  <div key={activity.id} style={{ position: 'relative' }}>
                    <button onClick={() => { setViewingActivity(activity); navigate('activitydetail', 'home'); }} style={{
                      background: activity.color, borderRadius: 16, padding: '14px', border: 'none',
                      cursor: 'pointer', textAlign: 'left', opacity: 0.5,
                      transition: 'transform 0.15s',
                      textDecoration: 'line-through',
                      width: '100%'
                    }}
                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Google Sans', color: '#111', lineHeight: 1.3 }}>{activity.name}</span>
                        <span style={{ fontSize: 14 }}>✓</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#333', marginTop: 4, fontFamily: 'Google Sans' }}>{activity.place}</div>
                      <div style={{ fontSize: 10, color: '#444', marginTop: 6, fontFamily: 'Google Sans' }}>{activity.time}</div>
                    </button>
                    <input 
                      type="checkbox" 
                      checked={activity.completed}
                      onChange={(e) => { e.stopPropagation(); toggleComplete(activity.id); }}
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        width: 16,
                        height: 16,
                        cursor: 'pointer',
                        accentColor: '#111'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FAB />
    </div>
  );
}
