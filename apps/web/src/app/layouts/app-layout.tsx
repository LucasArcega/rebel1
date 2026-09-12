import { Link, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { offlineChordStorage, offlineLibraryQueryKey } from '@/entities/offline-chord';
import { AppShell } from '@/shared/ui';

export const AppLayout = () => {
  const { data: offlineItems = [] } = useQuery({
    queryKey: offlineLibraryQueryKey,
    queryFn: () => offlineChordStorage.list(),
  });

  return (
    <AppShell
      header={(
        <>
          <Link to="/" className="app-logo">Cifra Hub</Link>
          <nav className="app-nav">
            <Link to="/library">
              Salvas {offlineItems.length > 0 && <span className="app-nav__count">{offlineItems.length}</span>}
            </Link>
          </nav>
        </>
      )}
    >
      <Outlet />
    </AppShell>
  );
};
