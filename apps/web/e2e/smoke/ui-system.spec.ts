import { expect, test } from '@playwright/test';

test.describe('catálogo do design system', () => {
  test('apresenta primitives, layouts e estados no servidor de desenvolvimento', async ({ page }) => {
    await page.goto('/ui-system');

    await expect(page.getByRole('heading', { name: 'Catálogo do design system', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar exemplo' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Fonte' })).toBeVisible();
    await expect(page.getByRole('slider', { name: 'BPM do catálogo' })).toBeVisible();

    await page.getByRole('button', { name: 'Primary' }).focus();
    await expect(page.getByRole('button', { name: 'Primary' })).toBeFocused();

    await page.getByRole('button', { name: 'Dica' }).hover();
    await expect(page.getByText('Somente texto descritivo')).toBeVisible();

    await page.getByRole('button', { name: 'Popover' }).click();
    const popoverAction = page.getByRole('button', { name: 'Ação interna' });
    await expect(popoverAction).toBeVisible();
    await popoverAction.focus();
    await expect(popoverAction).toBeFocused();
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Dialog' }).click();
    const dialog = page.getByRole('dialog', { name: 'Tarefa modal' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Fechar diálogo' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Dialog' })).toBeFocused();
  });

  test('mantém overlays inteiros nas quatro bordas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/ui-system');

    for (const name of ['Topo', 'Base', 'Esquerda', 'Direita']) {
      await page.getByRole('button', { name }).hover();
      const popup = page.getByRole('group', { name: `Preview ${name}` });
      await expect(popup).toBeVisible();
      const box = await popup.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(1440);
      expect(box!.y + box!.height).toBeLessThanOrEqual(900);
      await page.mouse.move(0, 0);
    }
  });
});
