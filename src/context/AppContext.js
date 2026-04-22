import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const COLORS = {
  orange: '#F4845F',
  red: '#FF4F6D',
  yellow: '#F5E642',
  cyan: '#00C2C7',
  green: '#C8F135',
  pink: '#FFB3C6',
  purple: '#5B5FEF',
  black: '#111111',
};

const INITIAL_ACTIVITIES = [
  { id: 1, name: 'Clay Modeling Workshop', place: '@ Emephar EM Glass', note: '', type: 'individual', color: '#F4845F', date: new Date(), time: '13:00', completed: false, pomodoroLinked: true },
  { id: 2, name: 'HomeWork 2', place: 'Circular Design', note: '', type: 'group', color: '#C8F135', date: new Date(), time: '20:00', completed: false, pomodoroLinked: false },
  { id: 3, name: 'HomeWork 3', place: 'Tech Design', note: '', type: 'group', color: '#A8E6CF', date: new Date(), time: '21:00', completed: false, pomodoroLinked: false },
  { id: 4, name: 'SELF Smoothies', place: 'Koopoon and Friends', note: '', type: 'individual', color: '#00C2C7', date: new Date(), time: '18:00', completed: true, pomodoroLinked: false },
  { id: 5, name: 'HomeWork 2', place: '@ Emephar', note: '', type: 'group', color: '#FFE566', date: new Date(), time: '14:00', completed: false, pomodoroLinked: false },
];

const INITIAL_POMODORO_SESSIONS = [
  { id: 1, name: 'Focus', duration: 30, type: 'focus' },
  { id: 2, name: 'Break', duration: 5, type: 'break' },
  { id: 3, name: 'Long Break', duration: 10, type: 'longbreak' },
];

export function AppProvider({ children }) {
  const [page, setPage] = useState('home');
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [pomodoroSessions, setPomodoroSessions] = useState(INITIAL_POMODORO_SESSIONS);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [prevPage, setPrevPage] = useState('home');

  const navigate = (to, from) => {
    setPrevPage(from || page);
    setPage(to);
  };

  const addActivity = (activity) => {
    setActivities(prev => [...prev, { ...activity, id: Date.now(), completed: false }]);
  };

  const updateActivity = (id, updates) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteActivity = (id) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const toggleComplete = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const today = new Date();
  const todayActivities = activities.filter(a => {
    const d = new Date(a.date);
    return d.toDateString() === today.toDateString();
  });

  return (
    <AppContext.Provider value={{
      page, navigate, prevPage,
      activities, addActivity, updateActivity, deleteActivity, toggleComplete,
      todayActivities,
      pomodoroSessions, setPomodoroSessions,
      editingActivity, setEditingActivity,
      viewingActivity, setViewingActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
