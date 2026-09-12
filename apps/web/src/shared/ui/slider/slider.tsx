import type { ComponentProps, ReactNode } from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cx } from '../lib/cx';

type SliderControlProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-label': string;
};

const Root = ({ className, ...props }: ComponentProps<typeof BaseSlider.Root>) => (
  <BaseSlider.Root data-slot="slider" className={cx('ui-slider', className)} {...props} />
);

const Label = ({ className, ...props }: ComponentProps<typeof BaseSlider.Label>) => (
  <BaseSlider.Label data-slot="slider-label" className={cx('ui-slider-label', className)} {...props} />
);

const Control = ({ className, ...props }: ComponentProps<typeof BaseSlider.Control>) => (
  <BaseSlider.Control data-slot="slider-control" className={cx('ui-slider-control', className)} {...props} />
);

const Track = ({ className, ...props }: ComponentProps<typeof BaseSlider.Track>) => (
  <BaseSlider.Track data-slot="slider-track" className={cx('ui-slider-track', className)} {...props} />
);

const Indicator = ({ className, ...props }: ComponentProps<typeof BaseSlider.Indicator>) => (
  <BaseSlider.Indicator data-slot="slider-indicator" className={cx('ui-slider-indicator', className)} {...props} />
);

const Thumb = ({ className, ...props }: ComponentProps<typeof BaseSlider.Thumb>) => (
  <BaseSlider.Thumb data-slot="slider-thumb" className={cx('ui-slider-thumb', className)} {...props} />
);

const Value = ({ className, ...props }: ComponentProps<typeof BaseSlider.Value>) => (
  <BaseSlider.Value data-slot="slider-value" className={className} {...props} />
);

function SliderControl({
  value,
  onValueChange,
  min,
  max,
  step,
  label,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SliderControlProps) {
  return (
    <Root
      value={value}
      onValueChange={(next) => onValueChange(typeof next === 'number' ? next : next[0])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={className}
    >
      {label ? <Label>{label}</Label> : null}
      <Control>
        <Track>
          <Indicator />
          <Thumb aria-label={ariaLabel} />
        </Track>
      </Control>
    </Root>
  );
}

export const Slider = Object.assign(SliderControl, {
  Root,
  Label,
  Control,
  Track,
  Indicator,
  Thumb,
  Value,
});
