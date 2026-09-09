import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSearchChordForm = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return {
    query,
    setQuery,
    submit,
  };
};
