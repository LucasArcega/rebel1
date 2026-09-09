import { AppRouter } from './router/app-router';
import { QueryProvider } from './providers/query-provider';
import './styles/global.css';

export const App = () => (
  <QueryProvider>
    <AppRouter />
  </QueryProvider>
);
