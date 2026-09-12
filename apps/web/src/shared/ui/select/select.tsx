import type { ComponentProps, ReactNode } from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from '../lib/cx';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

type SelectControlProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  items: readonly SelectOption<T>[];
  label?: ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

const Root = <Value,>(props: ComponentProps<typeof BaseSelect.Root<Value>>) => (
  <BaseSelect.Root {...props} />
);

const Trigger = ({ className, ...props }: ComponentProps<typeof BaseSelect.Trigger>) => (
  <BaseSelect.Trigger data-slot="select-trigger" className={cx('ui-select-trigger', className)} {...props} />
);

const Value = ({ className, ...props }: ComponentProps<typeof BaseSelect.Value>) => (
  <BaseSelect.Value data-slot="select-value" className={className} {...props} />
);

const Icon = ({ className, children = '▾', ...props }: ComponentProps<typeof BaseSelect.Icon>) => (
  <BaseSelect.Icon data-slot="select-icon" className={cx('ui-select-icon', className)} {...props}>
    {children}
  </BaseSelect.Icon>
);

const Label = ({ className, ...props }: ComponentProps<typeof BaseSelect.Label>) => (
  <BaseSelect.Label data-slot="select-label" className={cx('ui-select-label', className)} {...props} />
);

const Portal = (props: ComponentProps<typeof BaseSelect.Portal>) => <BaseSelect.Portal {...props} />;

const Positioner = ({
  sideOffset = 4,
  collisionPadding = 12,
  alignItemWithTrigger = false,
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Positioner>) => (
  <BaseSelect.Positioner
    data-slot="select-positioner"
    className={cx('ui-select-positioner', className)}
    sideOffset={sideOffset}
    collisionPadding={collisionPadding}
    alignItemWithTrigger={alignItemWithTrigger}
    {...props}
  />
);

const Popup = ({ className, ...props }: ComponentProps<typeof BaseSelect.Popup>) => (
  <BaseSelect.Popup data-slot="select-popup" className={cx('ui-select-popup', className)} {...props} />
);

const List = ({ className, ...props }: ComponentProps<typeof BaseSelect.List>) => (
  <BaseSelect.List data-slot="select-list" className={className} {...props} />
);

const Item = ({ className, ...props }: ComponentProps<typeof BaseSelect.Item>) => (
  <BaseSelect.Item data-slot="select-item" className={cx('ui-select-item', className)} {...props} />
);

const ItemText = (props: ComponentProps<typeof BaseSelect.ItemText>) => (
  <BaseSelect.ItemText data-slot="select-item-text" {...props} />
);

function SelectControl<T extends string>({
  value,
  onValueChange,
  items,
  label,
  id,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SelectControlProps<T>) {
  const itemMap = Object.fromEntries(items.map((item) => [item.value, item.label]));

  return (
    <Root
      value={value}
      onValueChange={(next) => {
        if (next == null) return;
        onValueChange(next as T);
      }}
      items={itemMap}
      disabled={disabled}
    >
      {label ? <Label>{label}</Label> : null}
      <Trigger id={id} aria-label={ariaLabel} className={className}>
        <Value />
        <Icon />
      </Trigger>
      <Portal>
        <Positioner>
          <Popup>
            <List>
              {items.map((item) => (
                <Item key={item.value} value={item.value}>
                  <ItemText>{item.label}</ItemText>
                </Item>
              ))}
            </List>
          </Popup>
        </Positioner>
      </Portal>
    </Root>
  );
}

export const Select = Object.assign(SelectControl, {
  Root,
  Trigger,
  Value,
  Icon,
  Label,
  Portal,
  Positioner,
  Popup,
  List,
  Item,
  ItemText,
});
