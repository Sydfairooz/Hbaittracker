'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

type Habit = { id: string; title: string; status: 'TICK' | 'CROSS' | 'PENDING' };
type Attendance = { id: string; title: string; date: string; status: 'PRESENT' | 'ABSENT' | 'PENDING' };
type Notification = { id: string; title: string; message: string; isRead: boolean };

export function UserDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  async function load() {
    const data = await fetch('/api/user/dashboard').then((r) => r.json());
    setHabits(data.habits);
    setAttendance(data.attendance);
    setNotifications(data.notifications);
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, []);

  async function markHabit(habitId: string, status: 'TICK' | 'CROSS') {
    await fetch('/api/user/habit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId, status })
    });
    load();
  }

  async function markAttendance(requiredDateId: string, status: 'PRESENT' | 'ABSENT') {
    await fetch('/api/user/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requiredDateId, status })
    });
    load();
  }

  return (
    <main className="container grid" style={{ paddingTop: '1.5rem' }}>
      <h2>User Dashboard</h2>
      <div className="card">
        <h3>Daily Habits ({format(new Date(), 'PPP')})</h3>
        <table className="table">
          <thead><tr><th>Habit</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td>{habit.title}</td>
                <td>{habit.status}</td>
                <td>
                  <button onClick={() => markHabit(habit.id, 'TICK')} style={{ background: '#22c55e', color: 'white', marginRight: '.5rem' }}>✓</button>
                  <button onClick={() => markHabit(habit.id, 'CROSS')} style={{ background: '#ef4444', color: 'white' }}>✗</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-3">
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3>Attendance Required Dates</h3>
          <table className="table">
            <thead><tr><th>Date</th><th>Title</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {attendance.map((item) => (
                <tr key={item.id}>
                  <td>{format(new Date(item.date), 'PP')}</td>
                  <td>{item.title}</td>
                  <td>{item.status}</td>
                  <td>
                    <button onClick={() => markAttendance(item.id, 'PRESENT')} style={{ background: '#2563eb', color: 'white', marginRight: '.5rem' }}>Present</button>
                    <button onClick={() => markAttendance(item.id, 'ABSENT')} style={{ background: '#f97316', color: 'white' }}>Absent</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Reminder Panel</h3>
          {notifications.map((n) => (
            <div key={n.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '.4rem 0' }}>
              <strong>{n.title}</strong>
              <p style={{ margin: 0 }}>{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
