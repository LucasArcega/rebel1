import type { HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type SurfaceTone = 'base' | 'raised' | 'interactive';

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SurfaceTone;
}

export const Surface = ({ tone = 'base', className, ...props }: SurfaceProps) => (
  <div data-slot="surface" data-tone={tone} className={cx('ui-surface', className)} {...props} />
);
