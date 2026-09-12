import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { IconButton } from '../icon-button/icon-button';

describe('Button', () => {
  it('exposes a stable data-slot and variant', () => {
    render(<Button variant="danger">Excluir</Button>);
    const button = screen.getByRole('button', { name: 'Excluir' });
    expect(button.getAttribute('data-slot')).toBe('button');
    expect(button.getAttribute('data-variant')).toBe('danger');
  });

  it('stays disabled and busy while loading without dropping the label', () => {
    render(<Button loading>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button).toHaveProperty('disabled', true);
  });
});

describe('IconButton', () => {
  it('requires an accessible name', () => {
    render(<IconButton aria-label="Fechar">×</IconButton>);
    expect(screen.getByRole('button', { name: 'Fechar' }).getAttribute('data-slot')).toBe('icon-button');
  });
});
