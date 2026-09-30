import { expect, test } from '@playwright/test';

const errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('loads only on activation, speaks, stays single and can reopen', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.reload();
  const launcher = page.getByRole('button', { name: 'Abrir BonziBuddy' });
  await expect(launcher).toBeVisible();
  await expect(page.getByRole('region', { name: 'BonziBuddy' })).toHaveCount(0);
  expect(requests.filter((url) => url.endsWith('/purple.png'))).toHaveLength(0);
  await launcher.click();
  const bonzi = page.getByRole('region', { name: 'BonziBuddy' });
  await expect(bonzi).toBeVisible();
  await expect(bonzi).toContainText('Oi!');
  await launcher.click();
  await expect(bonzi).toHaveCount(1);
  await page.getByRole('button', { name: 'Conversar com Bonzi' }).click();
  await expect(bonzi.locator('.bonzi-bubble')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Pausar' }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
  await page.getByRole('button', { name: 'Tchau, Bonzi' }).click();
  await expect(bonzi).toHaveCount(0);
  await expect(launcher).toBeFocused();
  await launcher.press('Enter');
  await expect(bonzi).toBeVisible();
});

test('failed asset can be retried', async ({ page }) => {
  await page.route('**/bonzi/purple.png', (route) => route.abort());
  const launcher = page.getByRole('button', { name: 'Abrir BonziBuddy' });
  await launcher.click();
  await expect(page.getByRole('status')).toContainText('Tentar novamente');
  await page.unroute('**/bonzi/purple.png');
  await launcher.click();
  await expect(page.getByRole('region', { name: 'BonziBuddy' })).toBeVisible();
});

test('requested speech still expires while paused and taskbar size is respected', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Abrir BonziBuddy' }).click();
  const bonzi = page.getByRole('region', { name: 'BonziBuddy' });
  await expect(bonzi).toBeVisible();
  await page.clock.install();
  await page.getByRole('button', { name: 'Pausar' }).click();
  await page.getByRole('button', { name: 'Conversar com Bonzi' }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(6200);
  await expect(bonzi.locator('.bonzi-bubble')).toHaveCount(0);
  await page.addStyleTag({ content: '.site-bottom .w98-taskbar { min-height: 100px; }' });
  await page.clock.runFor(100);
  const box = (await bonzi.boundingBox())!;
  const taskbar = (await page.locator('.site-bottom .w98-taskbar').boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(taskbar.y);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
]) {
  test(`fits viewport and keeps controls accessible at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.getByRole('button', { name: 'Abrir BonziBuddy' }).click();
    const bonzi = page.getByRole('region', { name: 'BonziBuddy' });
    await expect(bonzi).toBeVisible();
    const box = await bonzi.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height - 32);
    await expect(page.getByRole('button', { name: 'Tchau, Bonzi' })).toBeInViewport();
    await page.screenshot({ path: `test-results/bonzi-${viewport.width}.png` });
  });
}

test('gesture plays under focus, reading holds bubble and reduced motion stops travel', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Abrir BonziBuddy' }).click();
  const bonzi = page.getByRole('region', { name: 'BonziBuddy' });
  await expect(bonzi).toBeVisible();
  await page.clock.install();
  await page.clock.runFor(2000);
  await page.getByRole('button', { name: 'Conversar com Bonzi' }).click();
  await page.clock.runFor(100);
  const frame = await bonzi.getAttribute('data-frame');
  await page.clock.runFor(300);
  expect(await bonzi.getAttribute('data-frame')).not.toBe(frame);
  await bonzi.locator('.bonzi-bubble').focus();
  await page.clock.runFor(7000);
  await expect(bonzi.locator('.bonzi-bubble')).toBeVisible();
  await page.getByRole('button', { name: 'Conversar com Bonzi' }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(6200);
  await expect(bonzi.locator('.bonzi-bubble')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(100);
  const position = await bonzi.getAttribute('style');
  await page.clock.runFor(16000);
  await expect(bonzi).toHaveAttribute('data-frame', '0');
  expect(await bonzi.getAttribute('style')).toBe(position);
});

test('patrol, pause, hidden tab, resize, and dismissal during travel', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.reload();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Abrir BonziBuddy' }).click();
  const bonzi = page.getByRole('region', { name: 'BonziBuddy' });
  await expect(bonzi).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.install();
  await page.clock.runFor(9800);
  await expect(bonzi).toHaveAttribute('data-state', 'moving');
  const start = await bonzi.getAttribute('style');
  await page.clock.runFor(200);
  expect(await bonzi.getAttribute('style')).not.toBe(start);
  // Deterministic visibility event exercises the production suspension listener.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hiddenPosition = await bonzi.getAttribute('style');
  await page.clock.runFor(60000);
  expect(await bonzi.getAttribute('style')).toBe(hiddenPosition);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(200);
  await page.getByRole('button', { name: 'Pausar' }).click();
  const stopped = await bonzi.getAttribute('style');
  await page.clock.runFor(2000);
  expect(await bonzi.getAttribute('style')).toBe(stopped);
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(page.getByRole('button', { name: 'Tchau, Bonzi' })).toBeInViewport();
  await page.getByRole('button', { name: 'Tchau, Bonzi' }).click();
  await page.clock.runFor(1800);
  await expect(bonzi).toHaveCount(0);
});

test('ten reopen cycles, underlying apps, and home navigation cleanup', async ({ page }) => {
  const launcher = page.getByRole('button', { name: 'Abrir BonziBuddy' });
  const bonzi = page.getByRole('region', { name: 'BonziBuddy' });
  await page.clock.install();
  for (let i = 0; i < 10; i++) {
    await launcher.click();
    await expect(bonzi).toHaveCount(1);
    await page.getByRole('button', { name: 'Tchau, Bonzi' }).click();
    await page.clock.runFor(1800);
    await expect(bonzi).toHaveCount(0);
  }
  await launcher.click();
  await expect(bonzi).toBeVisible();
  await page.getByRole('link', { name: 'Programação.exe', exact: true }).click();
  await expect(page.locator('.os-frame')).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Área de trabalho' })
    .getByRole('link', { name: 'Inscrição.txt', exact: true })
    .click();
  await expect(page.locator('.os-frame')).toHaveCount(2);
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  await expect(page.locator('.w98-startmenu')).toBeVisible();
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('link', { name: 'Programação.exe', exact: true }).click();
  await expect(page).toHaveURL(/\/programacao/);
  await expect(bonzi).toHaveCount(0);
  await page.clock.runFor(60000);
  await expect(bonzi).toHaveCount(0);
});
