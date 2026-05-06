import React from 'react';
import { useApp } from '../context/AppContext';
import { TypeBadge, PageLogo } from '../components/SharedComponents';

export default function ActivityDetailPage() {
  const { viewingActivity, setViewingActivity, deleteActivity, setEditingActivity, navigate, prevPage } = useApp();
  const a = viewingActivity;
  if (!a) return null;

  const handleDelete = () => {
    deleteActivity(a.id);
    setViewingActivity(null);
    navigate(prevPage || 'home');
  };

  const handleEdit = () => {
    setEditingActivity(a);
    navigate('addtask', 'activitydetail');
  };

  const dateStr = new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const openGoogleCalendar = () => {
    const [h, m] = (a.time || '12:00').split(':').map(Number);
    const start = new Date(a.date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    const fmt = d => {
      const p = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
    };
    const details = [a.note, a.type === 'group' ? '👥 Group Task' : '👤 Individual Task'].filter(Boolean).join('\n');
    const params = new URLSearchParams({ action: 'TEMPLATE', text: a.name, dates: `${fmt(start)}/${fmt(end)}`, details, location: a.place || '' });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* Colored header */}
      <div style={{ background: a.color, padding: '52px 20px 28px', minHeight: 180, position: 'relative' }}>
        <PageLogo />
        <button onClick={() => { setViewingActivity(null); navigate(prevPage || 'home'); }} style={{
          width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.8)',
          border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 700, marginBottom: 16,
        }}>‹</button>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Google Sans', color: '#111', lineHeight: 1.2 }}>{a.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span style={{
            background: '#111', color: 'white', borderRadius: 20, padding: '3px 10px',
            fontSize: 11, fontWeight: 700, fontFamily: 'Google Sans',
          }}>{a.time}</span>
          <span style={{ fontSize: 12, fontFamily: 'Google Sans', color: '#333' }}>{dateStr}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <TypeBadge type={a.type} />
        </div>

        {a.place && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#999', fontFamily: 'Google Sans', fontWeight: 600, marginBottom: 4 }}>PLACE</div>
            <div style={{ fontSize: 14, fontFamily: 'Google Sans', color: '#111' }}>📍 {a.place}</div>
          </div>
        )}

        {a.note && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#999', fontFamily: 'Google Sans', fontWeight: 600, marginBottom: 4 }}>NOTES</div>
            <div style={{ fontSize: 14, fontFamily: 'Google Sans', color: '#111' }}>{a.note}</div>
          </div>
        )}

        {a.pomodoroLinked && (
          <div style={{ marginBottom: 16 }}>
            <button onClick={() => navigate('pomodoro')} style={{
              background: '#111', color: 'white', border: 'none', borderRadius: 20,
              padding: '8px 16px', fontSize: 13, fontFamily: 'Google Sans', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>🍅 Pomodoro linked</button>
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: '#999', fontFamily: 'Google Sans', fontWeight: 600, marginBottom: 6 }}>STATUS</div>
          <span style={{
            background: a.completed ? '#C8F135' : '#f0f0f0',
            color: '#111', borderRadius: 20, padding: '5px 14px',
            fontSize: 12, fontFamily: 'Google Sans', fontWeight: 600,
          }}>{a.completed ? '✓ Completed' : '○ Not completed'}</span>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={openGoogleCalendar} style={{
            border: '1.5px solid #111', background: 'transparent', borderRadius: 20,
            padding: '8px 16px', fontSize: 13, fontFamily: 'Google Sans', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>📅 Add Calendar</button>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '12px 20px 32px', display: 'flex', gap: 12 }}>
        <button onClick={handleEdit} style={{
          flex: 1, background: 'transparent', color: '#111',
          border: '1.5px solid #ddd', borderRadius: 30, padding: '13px',
          fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', cursor: 'pointer',
        }}>edit ✏️</button>
        <button onClick={handleDelete} style={{
          flex: 1, background: 'transparent', color: '#FF4F6D',
          border: '1.5px solid #FF4F6D', borderRadius: 30, padding: '13px',
          fontSize: 14, fontWeight: 700, fontFamily: 'Google Sans', cursor: 'pointer',
        }}>Delete 🗑️</button>
      </div>
    </div>
  );
}
