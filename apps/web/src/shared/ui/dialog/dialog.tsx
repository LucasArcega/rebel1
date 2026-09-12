import type { ComponentProps } from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cx } from '../lib/cx';

export type DialogSize = 'compact' | 'default' | 'wide';

const Root = (props: ComponentProps<typeof BaseDialog.Root>) => <BaseDialog.Root {...props} />;

const Trigger = ({ className, ...props }: ComponentProps<typeof BaseDialog.Trigger>) => (
  <BaseDialog.Trigger data-slot="dialog-trigger" className={className} {...props} />
);

const Portal = (props: ComponentProps<typeof BaseDialog.Portal>) => <BaseDialog.Portal {...props} />;

const Backdrop = ({ className, ...props }: ComponentProps<typeof BaseDialog.Backdrop>) => (
  <BaseDialog.Backdrop data-slot="dialog-backdrop" className={cx('ui-dialog-backdrop', className)} {...props} />
);

const Viewport = ({ className, ...props }: ComponentProps<typeof BaseDialog.Viewport>) => (
  <BaseDialog.Viewport data-slot="dialog-viewport" className={cx('ui-dialog-viewport', className)} {...props} />
);

const Popup = ({
  className,
  size = 'default',
  ...props
}: ComponentProps<typeof BaseDialog.Popup> & { size?: DialogSize }) => (
  <BaseDialog.Popup
    data-slot="dialog-popup"
    data-size={size}
    className={cx('ui-dialog-popup', className)}
    {...props}
  />
);

const Title = ({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) => (
  <BaseDialog.Title data-slot="dialog-title" className={cx('ui-dialog-title', className)} {...props} />
);

const Description = ({ className, ...props }: ComponentProps<typeof BaseDialog.Description>) => (
  <BaseDialog.Description data-slot="dialog-description" className={cx('ui-dialog-description', className)} {...props} />
);

const Close = ({ className, ...props }: ComponentProps<typeof BaseDialog.Close>) => (
  <BaseDialog.Close data-slot="dialog-close" className={className} {...props} />
);

export const Dialog = Object.assign(Root, {
  Trigger,
  Portal,
  Backdrop,
  Viewport,
  Popup,
  Title,
  Description,
  Close,
});
