import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-ghost';

  return <button className={`btn ${variantClass} ${className}`} {...props} />;
};
