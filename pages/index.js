import React from 'react';
import { useApp } from '../src/context/AppContext';
import BottomNav from '../src/components/BottomNav';
import HomePage from '../src/pages/HomePage';
import AddTaskPage from '../src/pages/AddTaskPage';
import TasksPage from '../src/pages/TasksPage';
import PomodoroPage from '../src/pages/PomodoroPage';
import PomodoroEditPage from '../src/pages/PomodoroEditPage';
import CalendarPage from '../src/pages/CalendarPage';
import ActivityDetailPage from '../src/pages/ActivityDetailPage';

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
    </div>
  );
}

export default Router;
