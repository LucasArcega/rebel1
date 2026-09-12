export const cx = (...parts: unknown[]) =>
  parts.filter((part): part is string => typeof part === 'string' && part.length > 0).join(' ');
