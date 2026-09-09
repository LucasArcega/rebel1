import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { SongPage } from '@/pages/song';
import { AppLayout } from '../layouts/app-layout';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/artists/:artist/songs/:song" element={<SongPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
