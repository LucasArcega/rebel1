import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type SpaceToken = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const gapVar = (gap: SpaceToken) => `var(--space-${gap})`;

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: SpaceToken;
}

export const Stack = ({ gap = 4, className, style, ...props }: StackProps) => (
  <div
    data-slot="stack"
    className={cx('ui-stack', className)}
    style={{ '--ui-gap': gapVar(gap), ...style } as CSSProperties}
    {...props}
  />
);
