import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './popover';
import { Dialog } from '../dialog/dialog';
import { Tooltip } from '../tooltip/tooltip';

describe('Popover', () => {
  it('opens from the trigger and closes with Escape', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Abrir preview</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <button type="button">Ação interna</button>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Abrir preview' }));
    expect(document.querySelector('[data-slot="popover-popup"]')).not.toBeNull();
    await user.keyboard('{Escape}');
    expect(document.querySelector('[data-slot="popover-popup"]')).toBeNull();
  });
});

describe('Dialog', () => {
  it('traps focus and restores it to the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Abrir diálogo</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="compact">
              <Dialog.Title>Tarefa modal</Dialog.Title>
              <Dialog.Close aria-label="Fechar diálogo">Fechar</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Abrir diálogo' });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Tarefa modal' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Tooltip', () => {
  it('shows descriptive text only', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger>Dica</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Somente texto descritivo</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole('button', { name: 'Dica' }));
    expect(await screen.findByText('Somente texto descritivo')).toBeTruthy();
  });
});
