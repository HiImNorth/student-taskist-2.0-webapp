import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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

// duration stored as total seconds
const INITIAL_POMODORO_SESSIONS = [
  { id: 1, name: 'Focus', duration: 1800, type: 'focus' },
  { id: 2, name: 'Break', duration: 300, type: 'break' },
  { id: 3, name: 'Long Break', duration: 600, type: 'longbreak' },
];

export function AppProvider({ children }) {
  const [page, setPage] = useState('home');
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [pomodoroSessions, setPomodoroSessions] = useState(INITIAL_POMODORO_SESSIONS);
  const [editingActivity, setEditingActivity] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [prevPage, setPrevPage] = useState('home');

  const [pomodoroMode, setPomodoroMode] = useState('focus');
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroLinkedActivity, setPomodoroLinkedActivity] = useState(null);
  const [pomodoroCustomTotal, setPomodoroCustomTotal] = useState(null);
  const [pomodoroFinished, setPomodoroFinished] = useState(false);
  const [pomodoroFinishedMode, setPomodoroFinishedMode] = useState(null);

  const pomodoroSession = pomodoroSessions.find(s => s.type === pomodoroMode) || pomodoroSessions[0];
  const pomodoroTotalSeconds =
    pomodoroMode === 'custom' && pomodoroCustomTotal !== null
      ? pomodoroCustomTotal
      : (pomodoroSession?.duration || 1800);
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(pomodoroTotalSeconds);

  const prevModeRef = useRef(pomodoroMode);
  const pomodoroIntervalRef = useRef(null);
  const timerFinishedRef = useRef(false);
  const pomodoroModeRef = useRef(pomodoroMode);
  const sessionsInitialized = useRef(false);

  useEffect(() => {
    pomodoroModeRef.current = pomodoroMode;
  }, [pomodoroMode]);

  const playAlarmSound = () => {
    try {
      const AudioCtx = window.AudioContext || window['webkitAudioContext'];
      const audioCtx = new AudioCtx();
      const beep = (startTime, duration, freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = audioCtx.currentTime;
      beep(now, 0.25, 880);
      beep(now + 0.35, 0.25, 880);
      beep(now + 0.7, 0.5, 1100);
    } catch (_) {}
  };

  const sendNotification = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const labels = { focus: 'Focus', break: 'Break', longbreak: 'Long Break' };
    new Notification('Pomodoro Timer', {
      body: `${labels[pomodoroModeRef.current] || 'Session'} session complete!`,
      icon: '/favicon.ico',
    });
  };

  useEffect(() => {
    if (prevModeRef.current !== pomodoroMode) {
      prevModeRef.current = pomodoroMode;
      setPomodoroSecondsLeft(pomodoroTotalSeconds);
      setPomodoroRunning(false);
    }
  }, [pomodoroMode, pomodoroTotalSeconds]);

  useEffect(() => {
    if (!sessionsInitialized.current) { sessionsInitialized.current = true; return; }
    setPomodoroRunning(false);
    setPomodoroSecondsLeft(pomodoroTotalSeconds);
  }, [pomodoroSessions]);

  useEffect(() => {
    if (pomodoroRunning) {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroSecondsLeft(s => {
          if (s <= 1) {
            timerFinishedRef.current = true;
            clearInterval(pomodoroIntervalRef.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(pomodoroIntervalRef.current);
    }
    return () => clearInterval(pomodoroIntervalRef.current);
  }, [pomodoroRunning]);

  useEffect(() => {
    if (pomodoroSecondsLeft === 0 && timerFinishedRef.current) {
      timerFinishedRef.current = false;
      setPomodoroRunning(false);
      playAlarmSound();
      sendNotification();
      setPomodoroFinishedMode(pomodoroModeRef.current);
      setPomodoroFinished(true);
    }
  }, [pomodoroSecondsLeft]);

  const navigate = (to, from) => {
    setPrevPage(from || page);
    setPage(to);
  };

  const addActivity = (activity) => {
    setActivities(prev => [...prev, { id: Date.now(), completed: false, ...activity }]);
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
      pomodoroMode, setPomodoroMode,
      pomodoroRunning, setPomodoroRunning,
      pomodoroSecondsLeft, setPomodoroSecondsLeft,
      pomodoroTotalSeconds,
      pomodoroCustomTotal, setPomodoroCustomTotal,
      pomodoroFinished, setPomodoroFinished,
      pomodoroFinishedMode,
      pomodoroLinkedActivity, setPomodoroLinkedActivity,
      editingActivity, setEditingActivity,
      viewingActivity, setViewingActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
