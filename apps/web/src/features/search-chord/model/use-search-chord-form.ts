import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const useSearchChordForm = () => {
  const navigate = useNavigate();
  const [artist, setArtist] = useState('avenged-sevenfold');
  const [song, setSong] = useState('buried-alive--');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const artistSlug = slugify(artist);
    const songSlug = slugify(song);

    if (!artistSlug || !songSlug) return;

    navigate(`/artists/${artistSlug}/songs/${songSlug}`);
  };

  return {
    artist,
    song,
    setArtist,
    setSong,
    submit,
  };
};
