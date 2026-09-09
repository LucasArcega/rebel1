import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { LibraryPage } from '@/pages/library';
import { SearchPage } from '@/pages/search';
import { SongPage } from '@/pages/song';
import { AppLayout } from '../layouts/app-layout';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/artists/:artist/songs/:song" element={<SongPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
