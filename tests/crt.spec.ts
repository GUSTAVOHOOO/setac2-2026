import { expect, test, type Page } from '@playwright/test';

const runtimeErrors = new WeakMap<Page, string[]>();

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  return page.getByRole('button', { name: 'Monitor CRT', exact: true });
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat/i.test(message.text())) errors.push(message.text());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

test('CRT starts enabled and toggles from the real start menu', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
  const toggle = await openSettings(page);
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.crt-overlay')).toHaveCount(2);
  await expect(page.locator('body > .crt-overlay')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body > .crt-overlay')).toHaveCSS('pointer-events', 'none');
  await toggle.click();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('body > .crt-overlay')).toHaveCSS('display', 'none');
  expect(await page.evaluate(() => localStorage.getItem('setac2:crt'))).toBe('off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
  const restored = await openSettings(page);
  await expect(restored).toHaveAttribute('aria-pressed', 'false');
  await restored.click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
});

test('saved off preference is applied without React hydration', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('setac2:crt', 'off'));
  await page.route('**/_next/**/*.js', (route) => route.abort());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
  await expect(page.locator('body > .crt-overlay')).toHaveCSS('display', 'none');
});

test('invalid storage falls back to enabled', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('setac2:crt', 'invalid'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
  await expect(await openSettings(page)).toHaveAttribute('aria-pressed', 'true');
});

test('the phosphor mask does not add colored light to black regions', async ({ page }) => {
  await page.evaluate(() => {
    const black = document.createElement('div');
    black.setAttribute('aria-hidden', 'true');
    black.style.cssText =
      'position:fixed;left:600px;top:600px;width:24px;height:24px;background:#000;z-index:202;pointer-events:none';
    document.body.append(black);
  });
  const image = await page.screenshot({ clip: { x: 606, y: 606, width: 12, height: 12 } });
  const range = await page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, image.width, image.height).data;
    const channels = Array.from(data).filter((_, i) => i % 4 !== 3);
    return { min: Math.min(...channels), max: Math.max(...channels) };
  }, image.toString('base64'));
  expect(range.max - range.min).toBeLessThanOrEqual(1);
  expect(range.max).toBeLessThanOrEqual(3);
});

test('blocked storage does not break the control', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.reload();
  const toggle = await openSettings(page);
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
  await openSettings(page);
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
});

test('preference synchronizes across tabs and ignores unrelated storage', async ({
  page,
  context,
}) => {
  const other = await context.newPage();
  await other.emulateMedia({ reducedMotion: 'reduce' });
  await other.goto('/');
  const errors: string[] = [];
  other.on('pageerror', (error) => errors.push(error.message));
  const remoteToggle = await openSettings(other);
  const toggle = await openSettings(page);
  await toggle.click();
  await expect(remoteToggle).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => localStorage.setItem('unrelated', 'on'));
  await expect(other.locator('html')).toHaveAttribute('data-crt', 'off');
  // sessionStorage is per top-level tab; deliver its event to the receiving document.
  await other.evaluate(() =>
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'setac2:crt',
        newValue: 'on',
        storageArea: sessionStorage,
      }),
    ),
  );
  await expect(other.locator('html')).toHaveAttribute('data-crt', 'off');
  await page.evaluate(() => localStorage.setItem('setac2:crt', 'invalid'));
  await expect(remoteToggle).toHaveAttribute('aria-pressed', 'true');
  // Native storage events update other tabs, not the tab performing a raw write.
  await remoteToggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(remoteToggle).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => localStorage.clear());
  await expect(remoteToggle).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
  await other.close();
});

for (const width of [1440, 390, 320]) {
  test(`keyboard control and menu fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    const toggle = await openSettings(page);
    await expect(toggle).toBeInViewport();
    const box = (await toggle.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    // Reach the control by real sequential keyboard navigation.
    for (
      let i = 0;
      i < 15 && !(await toggle.evaluate((el) => el === document.activeElement));
      i++
    ) {
      await page.keyboard.press('Tab');
    }
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveCSS('outline-style', 'dotted');
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Iniciar', exact: true })).toBeFocused();
  });
}

test('touch control and schedule navigation work on small phones', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 320, height: 568 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://localhost:3178/');
  await page.getByRole('button', { name: 'Iniciar', exact: true }).tap();
  const toggle = page.getByRole('button', { name: 'Monitor CRT', exact: true });
  await expect(toggle).toBeInViewport();
  await toggle.tap();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page
    .getByRole('navigation', { name: 'Menu Iniciar' })
    .getByRole('link', { name: /Programa/ })
    .tap();
  await expect(page).toHaveURL(/\/programacao/);
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
  await page.getByRole('button', { name: 'Iniciar', exact: true }).tap();
  await toggle.tap();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
  expect(errors).toEqual([]);
  await context.close();
});

test('decoration is static, hidden for forced colors and print, and below keyboard skip', async ({
  page,
}) => {
  const overlay = page.locator('body > .crt-overlay');
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    await page.emulateMedia({ reducedMotion });
    const paints = await overlay.evaluate((el) =>
      [null, '::before', '::after'].map((pseudo) => {
        const style = getComputedStyle(el, pseudo);
        return [style.animationName, style.transitionDuration, style.pointerEvents];
      }),
    );
    expect(paints).toEqual(Array.from({ length: 3 }, () => ['none', '0s', 'none']));
  }
  await page.emulateMedia({ forcedColors: 'active' });
  for (const layer of await page.locator('.crt-overlay').all()) {
    await expect(layer).toHaveCSS('display', 'none');
  }
  await page.emulateMedia({ forcedColors: 'none', media: 'print' });
  for (const layer of await page.locator('.crt-overlay').all()) {
    await expect(layer).toHaveCSS('display', 'none');
  }
  await page.emulateMedia({ media: 'screen' });
  await expect(overlay).toBeVisible();
  await page.locator('.site-skip').focus();
  expect(
    await page.locator('.site-skip').evaluate((el) => Number(getComputedStyle(el).zIndex)),
  ).toBeGreaterThan(await overlay.evaluate((el) => Number(getComputedStyle(el).zIndex)));
});

test('boot top-layer dialog has its own inert CRT layer and still skips', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => sessionStorage.removeItem('setac2:boot-seen'));
  await page.clock.install();
  await page.reload();
  const dialog = page.locator('.boot-screen');
  await expect(dialog).toHaveAttribute('open', '');
  expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
  const overlay = dialog.locator('.crt-overlay');
  await expect(overlay).toBeVisible();
  await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  await expect(overlay).toHaveCSS('pointer-events', 'none');
  expect(await overlay.boundingBox()).toEqual({ x: 0, y: 0, width: 1440, height: 900 });
  await page.getByRole('button', { name: 'Pular abertura' }).click();
  await expect(dialog).not.toHaveAttribute('open', '');
});

test('CRT never changes desktop window geometry, dragging or maximization', async ({ page }) => {
  await page
    .getByRole('navigation', { name: 'Área de trabalho' })
    .getByRole('link', { name: 'Programação.exe', exact: true })
    .click();
  const frame = page.locator('.os-frame').filter({ has: page.locator('.w98-schedule') });
  await expect(frame).toBeVisible();
  const initial = (await frame.boundingBox())!;
  const toggle = await openSettings(page);
  await toggle.click();
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  expect(await frame.boundingBox()).toEqual(initial);
  const title = (await frame.locator('.w98-titlebar').first().boundingBox())!;
  await page.mouse.move(title.x + 150, title.y + 10);
  await page.mouse.down();
  await page.mouse.move(title.x + 190, title.y + 60, { steps: 5 });
  await page.mouse.up();
  const dragged = (await frame.boundingBox())!;
  expect(dragged.x).toBeCloseTo(initial.x + 40, 0);
  expect(dragged.y).toBeCloseTo(initial.y + 50, 0);
  await frame.getByRole('button', { name: 'Maximizar', exact: true }).click();
  await expect(frame).toHaveClass(/is-max/);
  const maximized = (await frame.boundingBox())!;
  expect(maximized.x).toBe(0);
  expect(maximized.y).toBe(0);
  expect(maximized.width).toBe(1440);
  const taskbar = (await page.locator('.w98-taskbar').boundingBox())!;
  expect(maximized.height).toBeLessThanOrEqual(taskbar.y);
  await openSettings(page);
  await toggle.click();
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  expect(await frame.boundingBox()).toEqual(maximized);
  await frame.getByRole('button', { name: 'Restaurar', exact: true }).click();
  expect(await frame.boundingBox()).toEqual(dragged);
});
