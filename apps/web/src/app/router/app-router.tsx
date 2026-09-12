import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { LibraryPage } from '@/pages/library';
import { SearchPage } from '@/pages/search';
import { SongPage } from '@/pages/song';
import { AppLayout } from '../layouts/app-layout';

const UiSystemRoute = import.meta.env.DEV
  ? lazy(() => import('./ui-system-route').then((module) => ({ default: module.UiSystemRoute })))
  : null;

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/artists/:artist/songs/:song" element={<SongPage />} />
        {UiSystemRoute ? (
          <Route
            path="/ui-system"
            element={(
              <Suspense fallback={null}>
                <UiSystemRoute />
              </Suspense>
            )}
          />
        ) : null}
      </Route>
    </Routes>
  </BrowserRouter>
);
