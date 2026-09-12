import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { LibraryPage } from '@/pages/library';
import { SearchPage } from '@/pages/search';
import { SongPage } from '@/pages/song';
import { AppLayout } from '../layouts/app-layout';
import { UiSystemRoute } from './ui-system-route';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/artists/:artist/songs/:song" element={<SongPage />} />
        {import.meta.env.DEV ? <Route path="/ui-system" element={<UiSystemRoute />} /> : null}
      </Route>
    </Routes>
  </BrowserRouter>
);
