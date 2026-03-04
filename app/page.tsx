import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container" style={{ paddingTop: '4rem' }}>
      <div className="card">
        <h1>Habit & Attendance Tracker</h1>
        <p>Role-based staff habit and attendance management platform.</p>
        <Link href="/login">Go to Login</Link>
      </div>
    </main>
  );
}
