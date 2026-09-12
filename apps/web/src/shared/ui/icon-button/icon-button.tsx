import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../button/button';
import { cx } from '../lib/cx';

type IconButtonProps = Omit<ButtonProps, 'children'> & {
  'aria-label': string;
  children: ReactNode;
};

export const IconButton = ({ className, children, ...props }: IconButtonProps) => (
  <Button data-slot="icon-button" className={cx('ui-icon-button', className)} {...props}>
    {children}
  </Button>
);
