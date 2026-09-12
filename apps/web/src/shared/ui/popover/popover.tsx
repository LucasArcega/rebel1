import type { ComponentProps } from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from '../lib/cx';

const Root = (props: ComponentProps<typeof BasePopover.Root>) => <BasePopover.Root {...props} />;

const Trigger = ({ className, ...props }: ComponentProps<typeof BasePopover.Trigger>) => (
  <BasePopover.Trigger data-slot="popover-trigger" className={className} {...props} />
);

const Portal = (props: ComponentProps<typeof BasePopover.Portal>) => <BasePopover.Portal {...props} />;

const Positioner = ({
  sideOffset = 8,
  collisionPadding = 12,
  className,
  ...props
}: ComponentProps<typeof BasePopover.Positioner>) => (
  <BasePopover.Positioner
    data-slot="popover-positioner"
    className={cx('ui-popover-positioner', className)}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    {...props}
  />
);

const Popup = ({ className, ...props }: ComponentProps<typeof BasePopover.Popup>) => (
  <BasePopover.Popup data-slot="popover-popup" className={cx('ui-popover-popup', className)} {...props} />
);

const Title = ({ className, ...props }: ComponentProps<typeof BasePopover.Title>) => (
  <BasePopover.Title data-slot="popover-title" className={className} {...props} />
);

const Description = ({ className, ...props }: ComponentProps<typeof BasePopover.Description>) => (
  <BasePopover.Description data-slot="popover-description" className={className} {...props} />
);

const Close = ({ className, ...props }: ComponentProps<typeof BasePopover.Close>) => (
  <BasePopover.Close data-slot="popover-close" className={className} {...props} />
);

export const Popover = Object.assign(Root, {
  Trigger,
  Portal,
  Positioner,
  Popup,
  Title,
  Description,
  Close,
});
