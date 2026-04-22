import React from 'react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'tasks', label: 'My Tasks', icon: TaskIcon },
  { id: 'groups', label: 'Group', icon: GroupIcon },
   { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'pomodoro', label: 'Pomodoro', icon: PomodoroIcon },
];

function HomeIcon({ active, fill }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fill || (active ? '#111' : '#999')}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}
function TaskIcon({ active, fill }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fill || (active ? '#111' : '#999')} strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}
function GroupIcon({ active, fill }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fill || (active ? '#111' : '#999')}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  );
}
function CalendarIcon({ active, fill }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fill || (active ? '#111' : '#999')} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function PomodoroIcon({ active, fill }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fill || (active ? '#111' : '#999')} strokeWidth="2">
      <circle cx="12" cy="13" r="8"/>
      <path d="M12 9v4l3 3"/>
      <path d="M9 3h6"/>
    </svg>
  );
}

export default function BottomNav() {
  const { page, navigate } = useApp();
  const activePage = ['home', 'addtask', 'activitydetail'].includes(page) ? 'home'
    : ['tasks'].includes(page) ? 'tasks'
    : ['groups'].includes(page) ? 'groups'
    : ['calendar'].includes(page) ? 'calendar'
    : ['pomodoro', 'pomodoro-edit'].includes(page) ? 'pomodoro'
    : page;

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 90, background: 'white',
      borderTop: '1px solid #eee',
      display: 'flex', alignItems: 'center',
      paddingBottom: 12, paddingTop: 6,
      zIndex: 100,
    }}>
    
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = activePage === id;
        const isHome = id === 'home';
        const scale = isHome ? 1.1 : 1;
        
        return (
          <button key={id} onClick={() => navigate(id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 0',
            transform: `scale(${scale})`,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: active ? '#111' : 'transparent',
              transition: 'all 0.2s',
            }}>
              <Icon active={active} fill={active ? 'white' : '#999'} />
            </div>
            <span style={{
              fontSize: 10, fontFamily: 'Google Sans', fontWeight: active ? 700 : 400,
              color: active ? '#111' : '#999', letterSpacing: 0.2,
            }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
