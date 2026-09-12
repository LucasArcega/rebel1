import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type SpaceToken = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  gap?: SpaceToken;
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  wrap?: boolean;
}

export const Inline = ({
  gap = 3,
  align = 'center',
  wrap = true,
  className,
  style,
  ...props
}: InlineProps) => (
  <div
    data-slot="inline"
    className={cx('ui-inline', className)}
    style={{
      '--ui-gap': `var(--space-${gap})`,
      alignItems: align,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style,
    } as CSSProperties}
    {...props}
  />
);
