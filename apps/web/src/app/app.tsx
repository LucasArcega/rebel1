import { Tooltip } from '@/shared/ui';
import { AppRouter } from './router/app-router';
import { QueryProvider } from './providers/query-provider';
import './styles/tokens.css';
import './styles/global.css';
import './styles/ui.css';

export const App = () => (
  <QueryProvider>
    <Tooltip.Provider>
      <AppRouter />
    </Tooltip.Provider>
  </QueryProvider>
);
