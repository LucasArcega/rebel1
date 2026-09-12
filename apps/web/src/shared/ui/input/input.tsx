import type { InputHTMLAttributes } from 'react';

export const Input = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input data-slot="input" className={`input ${className}`} {...props} />
);
