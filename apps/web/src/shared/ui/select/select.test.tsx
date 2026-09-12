import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';
import { Slider } from '../slider/slider';

describe('Select', () => {
  it('changes the selected option from the keyboard-accessible list', async () => {
    const user = userEvent.setup();
    const onValueChange = (value: string) => {
      current = value;
    };
    let current = 'sm';

    const view = render(
      <Select
        label="Fonte"
        value={current}
        onValueChange={onValueChange}
        items={[
          { value: 'sm', label: 'Pequena' },
          { value: 'md', label: 'Média' },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Fonte' }));
    await user.click(screen.getByRole('option', { name: 'Média' }));
    expect(current).toBe('md');
    view.unmount();
  });
});

describe('Slider', () => {
  it('exposes an accessible thumb', () => {
    render(<Slider aria-label="BPM" value={100} min={40} max={240} onValueChange={() => undefined} />);
    expect(screen.getByRole('slider', { name: 'BPM' })).toBeTruthy();
    expect(document.querySelector('[data-slot="slider-thumb"]')).not.toBeNull();
  });
});
