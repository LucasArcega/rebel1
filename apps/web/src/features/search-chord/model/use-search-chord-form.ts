import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useSearchChordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

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
