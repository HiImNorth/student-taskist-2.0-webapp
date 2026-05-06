import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import PomodoroCompleteModal from './components/PomodoroCompleteModal';
import HomePage from './pages/HomePage';
import AddTaskPage from './pages/AddTaskPage';
import TasksPage from './pages/TasksPage';
import PomodoroPage from './pages/PomodoroPage';
import PomodoroEditPage from './pages/PomodoroEditPage';
import CalendarPage from './pages/CalendarPage';
import ActivityDetailPage from './pages/ActivityDetailPage';

const PAGES_WITH_NAV = ['home', 'tasks', 'groups', 'calendar', 'pomodoro'];

function Router() {
  const { page } = useApp();
  const showNav = PAGES_WITH_NAV.includes(page);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
        {page === 'home' && <HomePage />}
        {page === 'addtask' && <AddTaskPage />}
        {page === 'tasks' && <TasksPage mode="individual" />}
        {page === 'groups' && <TasksPage mode="groups" />}
        {page === 'pomodoro' && <PomodoroPage />}
        {page === 'pomodoro-edit' && <PomodoroEditPage />}
        {page === 'calendar' && <CalendarPage />}
        {page === 'activitydetail' && <ActivityDetailPage />}
      </div>
      {showNav && <BottomNav />}
      <PomodoroCompleteModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
