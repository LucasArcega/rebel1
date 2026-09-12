import { lazy, Suspense } from 'react';

const UiSystemPage = lazy(() => import('@/pages/ui-system/ui/ui-system-page').then((mod) => ({ default: mod.UiSystemPage })));

export const UiSystemRoute = () => (
  <Suspense fallback={null}>
    <UiSystemPage />
  </Suspense>
);
