import type { ComponentProps } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../lib/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'compact' | 'default';

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'default',
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <BaseButton
    data-slot="button"
    data-variant={variant}
    data-size={size}
    data-loading={loading ? 'true' : undefined}
    className={cx('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...props}
  >
    <span className="ui-button__content">{children}</span>
    {loading ? <span className="ui-button__spinner" aria-hidden="true" /> : null}
  </BaseButton>
);
