import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/cx';

interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  header?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
}

export const AppShell = ({ header, sidebar, children, className, ...props }: AppShellProps) => (
  <div data-slot="app-shell" className={cx('app-shell', 'ui-app-shell', className)} {...props}>
    {header ? (
      <header data-slot="app-shell-header" className="app-header">
        {header}
      </header>
    ) : null}
    <div className={cx('ui-app-shell__body', sidebar ? 'ui-app-shell__body--with-sidebar' : undefined)}>
      {sidebar ? (
        <aside data-slot="app-shell-sidebar" className="ui-app-shell__sidebar">
          {sidebar}
        </aside>
      ) : null}
      <main data-slot="app-shell-content" className="app-main">
        {children}
      </main>
    </div>
  </div>
);
