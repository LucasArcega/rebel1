import { Link, Outlet } from 'react-router-dom';

export const AppLayout = () => (
  <div className="app-shell">
    <header className="app-header">
      <Link to="/" className="app-logo">Cifra Hub</Link>
      <nav className="app-nav">
        <Link to="/library">Salvas</Link>
      </nav>
    </header>
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);
