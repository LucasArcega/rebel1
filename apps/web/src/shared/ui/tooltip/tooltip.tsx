import type { ComponentProps } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from '../lib/cx';

const Provider = (props: ComponentProps<typeof BaseTooltip.Provider>) => <BaseTooltip.Provider {...props} />;

const Root = (props: ComponentProps<typeof BaseTooltip.Root>) => <BaseTooltip.Root {...props} />;

const Trigger = ({ className, ...props }: ComponentProps<typeof BaseTooltip.Trigger>) => (
  <BaseTooltip.Trigger data-slot="tooltip-trigger" className={className} {...props} />
);

const Portal = (props: ComponentProps<typeof BaseTooltip.Portal>) => <BaseTooltip.Portal {...props} />;

const Positioner = ({
  sideOffset = 8,
  collisionPadding = 12,
  className,
  ...props
}: ComponentProps<typeof BaseTooltip.Positioner>) => (
  <BaseTooltip.Positioner
    data-slot="tooltip-positioner"
    className={cx('ui-tooltip-positioner', className)}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    {...props}
  />
);

const Popup = ({ className, ...props }: ComponentProps<typeof BaseTooltip.Popup>) => (
  <BaseTooltip.Popup data-slot="tooltip-popup" className={cx('ui-tooltip-popup', className)} {...props} />
);

export const Tooltip = Object.assign(Root, {
  Provider,
  Trigger,
  Portal,
  Positioner,
  Popup,
});
