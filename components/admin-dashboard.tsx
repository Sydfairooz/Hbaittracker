'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Summary = { habitsDone: number; habitsMissed: number; attendancePresent: number; attendanceAbsent: number };

type User = { id: string; name: string; email: string; role: string };

export function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  async function load() {
    const [dash, userRes] = await Promise.all([
      fetch('/api/admin/dashboard').then((r) => r.json()),
      fetch('/api/admin/users').then((r) => r.json())
    ]);
    setSummary(dash.summary);
    setUsers(userRes.users);
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  async function createAttendanceDate() {
    await fetch('/api/admin/attendance-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date })
    });
    setTitle('');
    setDate('');
    load();
  }

  const chartData = summary
    ? [
        { name: 'Habits', Completed: summary.habitsDone, Missed: summary.habitsMissed },
        { name: 'Attendance', Present: summary.attendancePresent, Absent: summary.attendanceAbsent }
      ]
    : [];

  return (
    <main className="container grid" style={{ paddingTop: '1.5rem' }}>
      <h2>Admin Dashboard</h2>
      <div className="card">
        <h3>Statistics</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" fill="#22c55e" />
              <Bar dataKey="Missed" fill="#ef4444" />
              <Bar dataKey="Present" fill="#3b82f6" />
              <Bar dataKey="Absent" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-3">
        <div className="card">
          <h3>Required Attendance Date</h3>
          <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <button onClick={createAttendanceDate} style={{ background: '#1d4ed8', color: 'white', marginTop: '.75rem' }}>Create</button>
        </div>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3>Team Members</h3>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
