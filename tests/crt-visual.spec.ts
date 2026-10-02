import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test, type Page } from '@playwright/test';

const dir = path.resolve('test-results/crt/visual');
const viewports = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
];
const variants = ['off', 'on', 'strong'] as const;

async function setPreference(page: Page, enabled: boolean, keepMenu: boolean) {
  const start = page.getByRole('button', { name: 'Iniciar', exact: true });
  if ((await start.getAttribute('aria-expanded')) !== 'true') await start.click();
  const toggle = page.getByRole('button', { name: 'Monitor CRT', exact: true });
  if ((await toggle.getAttribute('aria-pressed')) !== String(enabled)) await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-crt', enabled ? 'on' : 'off');
  if (!keepMenu) await start.click();
  await page.mouse.move(0, 0);
}

async function captureScene(page: Page, stem: string, keepMenu: boolean, textSelector: string) {
  await setPreference(page, false, keepMenu);
  const viewport = page.viewportSize()!;
  const text = (await page.locator(textSelector).first().boundingBox())!;
  const clip = {
    x: Math.max(0, text.x),
    y: Math.max(0, text.y),
    width: Math.min(text.width, 520, viewport.width - Math.max(0, text.x)),
    height: Math.min(text.height, 180, viewport.height - Math.max(0, text.y)),
  };
  const screenshot = {
    animations: 'disabled' as const,
    caret: 'hide' as const,
    scale: 'device' as const,
  };
  for (const variant of variants) {
    await setPreference(page, variant !== 'off', keepMenu);
    const strong =
      variant === 'strong'
        ? await page.addStyleTag({
            content: `
      .crt-overlay { --crt-scanline: .24; --crt-rgb: .10; --crt-vignette: .30; }
    `,
          })
        : null;
    await page.screenshot({ ...screenshot, path: path.join(dir, `${stem}-${variant}.png`) });
    await page.screenshot({
      ...screenshot,
      clip,
      path: path.join(dir, `${stem}-${variant}-text.png`),
    });
    await strong?.evaluate((el) => el.parentNode?.removeChild(el));
  }
  const dpr = await page.evaluate(() => devicePixelRatio);
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Comparacao CRT: ${stem}</title>
    <style>
      body{margin:24px;background:#eee;color:#111;font:15px/1.5 Tahoma,sans-serif}
      a{color:#000080}section{display:flex;gap:20px;overflow:auto;padding-bottom:20px}
      figure{margin:0;flex:none}figcaption{font-weight:bold;margin-bottom:8px}
      img{display:block;max-width:480px;height:auto;border:1px solid #888}
      .detail img{max-width:none;image-rendering:pixelated}
    </style><h1>${stem}</h1><p><a href="index.html">Todas as comparacoes</a></p>
    <p>Mesma pagina e geometria. A versao forte e um experimento de teste, nao o efeito entregue.</p>
    <section>${variants
      .map(
        (variant) => `<figure><figcaption>${variant}</figcaption>
      <a href="${stem}-${variant}.png"><img src="${stem}-${variant}.png" alt="Tela ${variant}"></a>
      </figure>`,
      )
      .join('')}</section>
    <h2>Texto ampliado sem suavizacao</h2><section class="detail">${variants
      .map(
        (variant) => `<figure>
      <figcaption>${variant}</figcaption><img style="width:${clip.width * dpr * 2}px"
      src="${stem}-${variant}-text.png" alt="Detalhe de texto ${variant}"></figure>`,
      )
      .join('')}</section>
    </html>`;
  await writeFile(path.join(dir, `${stem}.html`), html);
}

for (const viewport of viewports) {
  for (const deviceScaleFactor of [1, 2]) {
    test.describe(`${viewport.width}px DPR ${deviceScaleFactor}`, () => {
      test.use({ viewport, deviceScaleFactor, reducedMotion: 'reduce' });
      test('captures matched home, menu, schedule and text', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await mkdir(dir, { recursive: true });
        await page.clock.setFixedTime(new Date('2026-10-01T12:00:00Z'));
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'Iniciar', exact: true })).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({
          content: `
          *, *::before, *::after { animation: none !important; transition: none !important; }
        `,
        });
        await page.waitForFunction(() =>
          Array.from(document.images).every(
            (img) =>
              img.getBoundingClientRect().width === 0 || (img.complete && img.naturalWidth > 0),
          ),
        );
        const suffix = `${viewport.width}x${viewport.height}-dpr${deviceScaleFactor}`;
        await captureScene(page, `home-${suffix}`, false, '.site-cmd-info');
        await captureScene(page, `menu-${suffix}`, true, '.crt-toggle');
        await page
          .getByRole('navigation', { name: 'Menu Iniciar' })
          .getByRole('link', { name: /Programa/ })
          .click();
        await expect(page.locator('.w98-schedule').last()).toBeVisible();
        if (viewport.width > 640) {
          const frame = page.locator('.os-frame').filter({ has: page.locator('.w98-schedule') });
          await frame.getByRole('button', { name: 'Maximizar', exact: true }).click();
          await expect(frame).toHaveClass(/is-max/);
        }
        await page.evaluate(() => document.fonts.ready);
        await captureScene(page, `schedule-${suffix}`, false, '.sch-item .sch-main');
        expect(errors).toEqual([]);
      });
    });
  }
}

test('captures the actual boot top layer', async ({ page }) => {
  await mkdir(dir, { recursive: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  await page.goto('/');
  const dialog = page.locator('.boot-screen');
  await expect(dialog).toHaveAttribute('open', '');
  await page.clock.runFor(1900);
  await expect(dialog).toHaveAttribute('data-phase', 'splash');
  await page.evaluate(() => document.fonts.ready);
  for (const enabled of [false, true]) {
    await page.evaluate((on) => {
      document.documentElement.dataset.crt = on ? 'on' : 'off';
      window.dispatchEvent(new Event('setac:crt-change'));
    }, enabled);
    await page.screenshot({
      path: path.join(dir, `boot-${enabled ? 'on' : 'off'}.png`),
      animations: 'disabled',
    });
  }
});

test.afterAll(async ({ browser }) => {
  await mkdir(dir, { recursive: true });
  const scenes = viewports
    .flatMap((viewport) =>
      [1, 2].flatMap((dpr) =>
        ['home', 'menu', 'schedule'].map(
          (scene) => `${scene}-${viewport.width}x${viewport.height}-dpr${dpr}`,
        ),
      ),
    )
    .filter((stem) => existsSync(path.join(dir, `${stem}.html`)));
  const links = scenes.map((stem) => `<li><a href="${stem}.html">${stem}</a></li>`);
  const boot = existsSync(path.join(dir, 'boot-on.png'))
    ? '<p><a href="boot-off.png">Abertura sem efeito</a> | <a href="boot-on.png">Abertura CRT</a></p>'
    : '';
  await writeFile(
    path.join(dir, 'index.html'),
    `<!doctype html><html lang="pt-BR">
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Monitor CRT: comparacoes</title><style>body{max-width:900px;margin:24px auto;padding:0 16px;
    font:16px/1.6 Tahoma,sans-serif;background:#eee;color:#111}a{color:#000080}</style>
    <h1>Monitor CRT: comparacoes reais</h1><p>Off, efeito entregue e experimento forte.
    Cada comparacao inclui detalhes ampliados de texto. Clique nas telas para ver o PNG original.</p>
    ${boot}
    <ul>${links.join('')}</ul></html>`,
  );
  const context = await browser.newContext({ viewport: { width: 1600, height: 1080 } });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.join(dir, 'index.html')).href);
  await expect(page.locator('li a')).toHaveCount(scenes.length);
  const previews = [
    scenes.find((stem) => stem === 'home-1440x900-dpr1') ??
      scenes.find((stem) => stem.startsWith('home-')),
    scenes.find((stem) => stem === 'schedule-390x844-dpr2') ??
      scenes.find((stem) => stem.startsWith('schedule-')),
  ].filter((stem): stem is string => Boolean(stem));
  for (const stem of previews) {
    await page.goto(pathToFileURL(path.join(dir, `${stem}.html`)).href);
    await expect(page.locator('img')).toHaveCount(6);
    await page.waitForFunction(() =>
      Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
    );
    await page.screenshot({
      path: path.join(dir, `comparison-${stem.split('-')[0]}.png`),
      fullPage: true,
    });
  }
  await context.close();
});
