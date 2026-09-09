import { Link, Outlet } from 'react-router-dom';

export const AppLayout = () => (
  <div className="app-shell">
    <header className="app-header">
      <Link to="/" className="app-logo">Cifra Hub</Link>
      <span className="app-badge">FSD + Bulletproof</span>
    </header>
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);
