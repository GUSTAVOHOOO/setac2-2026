# CRT Monitor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar textura CRT de PC discreta, ligada por padrao, com controle acessivel persistente e evidencias visuais inspecionadas em desktop/mobile.

**Architecture:** Bootstrap inline define `html[data-crt]` antes da pintura; um pequeno componente client com `useSyncExternalStore` sincroniza o controle e localStorage. Duas camadas CSS decorativas compartilham o dataset, uma no body e outra no dialog de boot, sem provider, deformacao ou efeitos temporais.

**Tech Stack:** Next.js 16.3.7 App Router, React 19.2.8, TypeScript, CSS global, Playwright 1.63.0/Chrome e scripts npm existentes.

---

## Regras de Execucao

Trabalhar em `C:\Users\Windows 11\Documents\setac 2026\site`. Especificacao: `docs/superpowers/specs/2026-10-01-crt-monitor-design.md`.

O usuario delegou decisoes: executar, verificar, inspecionar capturas e ajustar autonomamente. Nao parar para aprovacao de design, baseline ou execucao. Nao criar commits; nao abrir worktree adicional para esta entrega. Preservar mudancas de outros agentes. Esta entrega documental nao executou os comandos abaixo nem alterou producao/testes; os comandos sao instrucoes para a fase de implementacao.

Antes de codigo, ler `AGENTS.md` e os guias locais `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` e `node_modules/next/dist/docs/01-app/03-api-reference/02-components/script.md`. Manter o padrao de script inline ja usado pelo boot para prepaint; nao trocar por `afterInteractive`.

Usar `apply_patch` para edicoes manuais. Nao introduzir bibliotecas, migracoes, providers ou refatoracoes adjacentes. Executar comandos individualmente na raiz do app. Cada build deve preceder os testes de producao que verificam aquele codigo; Playwright inicia `npm run start -- --port 3178`, nao build/dev.

## Mapa de Arquivos

| Acao       | Caminho                              | Responsabilidade                                                 |
| ---------- | ------------------------------------ | ---------------------------------------------------------------- |
| Criar      | `src/components/crt/bootstrap.ts`    | Chave de persistencia e script prepaint sem React.               |
| Criar      | `src/components/crt/CrtToggle.tsx`   | Botao client, snapshot DOM e assinatura/limpeza de eventos.      |
| Criar      | `src/styles/crt.css`                 | Camadas, intensidades, botao local e excecoes de acessibilidade. |
| Modificar  | `src/app/layout.tsx`                 | Imports, data-crt, script e camada do body; preservar providers. |
| Modificar  | `src/components/win98/StartMenu.tsx` | Item CRT depois do separador, antes de BonziBuddy.               |
| Modificar  | `src/components/boot/BootScreen.tsx` | Apenas camada decorativa dentro do dialog.                       |
| Criar      | `tests/crt.spec.ts`                  | Contrato funcional, prepaint, acessibilidade e geometria.        |
| Criar      | `tests/crt-visual.spec.ts`           | Matriz deterministica off/on/forte e HTML comparativo.           |
| Reutilizar | `public/icons/computador.svg`        | Icone existente via PixelIcon, sem novo asset.                   |

Nao alterar `playwright.config.ts`, engine, OsProvider, bootstrap de boot ou tokens para implementar este efeito. Estilos locais resolvem as novas necessidades. Artefatos ficam sob `test-results/crt/`, nao em `public`. A verificacao final permitiu uma correcao pontual no seletor de `tests/bonzi.spec.ts`, documentada abaixo, sem alteracao do comportamento do Bonzi.

## Task 1: Contrato Funcional em RED

**Files:** criar `tests/crt.spec.ts`; ler `tests/bonzi.spec.ts`, `src/components/win98/StartMenu.tsx`, `src/components/win98/Window.tsx` e `src/components/os/OsProvider.tsx` para seletores e coordenadas existentes.

- [ ] Conferir o estado inicial com `git status --short`. O workspace foi informado limpo; se houver alteracoes novas, preservar e limitar o trabalho aos arquivos listados.
- [ ] Criar primeiro o teste minimo abaixo. Ao expandir a suite, o beforeEach dos casos comuns usa reduced motion para pular abertura; casos de boot devem usar contexto proprio com `no-preference`.

```ts
import { expect, test } from '@playwright/test';

test('CRT starts enabled and toggles from the real start menu', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'on');
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
  const toggle = page.getByRole('button', { name: 'Monitor CRT', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body > .crt-overlay')).toHaveCSS('pointer-events', 'none');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
  await expect(page.locator('body > .crt-overlay')).toHaveCSS('display', 'none');
  expect(await page.evaluate(() => localStorage.getItem('setac2:crt'))).toBe('off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
});
```

- [ ] Executar `npm run build` para servir o codigo atual. Esperado: build existente aprovado, ainda sem CRT. Se falhar por problema preexistente/ambiente, diagnosticar e registrar separadamente, sem mascarar o RED.
- [ ] Executar `npm run test:e2e -- tests/crt.spec.ts`. Esperado: FAIL por ausencia de `data-crt`/controle, nao por import quebrado, porta ocupada ou servidor desatualizado. Guardar a evidencia do RED antes de implementar.

## Task 2: Preferencia Prepaint e Controle Client

**Files:** criar `src/components/crt/bootstrap.ts` e `src/components/crt/CrtToggle.tsx`; modificar `src/app/layout.tsx` e `src/components/win98/StartMenu.tsx`; expandir `tests/crt.spec.ts`.

- [ ] Criar o bootstrap exatamente com esta API e normalizacao:

```ts
export const CRT_STORAGE_KEY = 'setac2:crt';

export const crtBootstrap = `(() => {
  let value = 'on';
  try {
    if (localStorage.getItem('${CRT_STORAGE_KEY}') === 'off') value = 'off';
  } catch {}
  document.documentElement.dataset.crt = value;
})();`;
```

- [ ] Criar o componente client com `useSyncExternalStore`. Definir `getSnapshot`, `getServerSnapshot` e `subscribe` fora do componente, sem leituras de DOM no escopo do modulo. O contrato central e:

```tsx
const CRT_CHANGE_EVENT = 'setac:crt-change';
const getSnapshot = () => document.documentElement.dataset.crt !== 'off';
const getServerSnapshot = () => true;

// Dentro de CrtToggle, com subscribe definido no mesmo arquivo:
const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
const toggle = () => {
  const next = getSnapshot() ? 'off' : 'on';
  document.documentElement.dataset.crt = next;
  try {
    localStorage.setItem(CRT_STORAGE_KEY, next);
  } catch {}
  window.dispatchEvent(new Event(CRT_CHANGE_EVENT));
};
```

- [ ] Implementar `subscribe(notify: () => void)`: listener custom chama `notify`; listener storage ignora chaves diferentes de CRT e null, ignora sessionStorage, define dataset com `event.newValue === 'off' ? 'off' : 'on'`, depois notifica. Se a verificacao de `event.storageArea` exigir acesso a localStorage, protege-lo com try/catch. Registrar listeners e retornar cleanup que remove ambos. Reusar a chave importada do bootstrap, sem duplicar literal na producao.

```ts
const subscribe = (notify: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CRT_STORAGE_KEY && event.key !== null) return;
    try {
      if (event.storageArea !== window.localStorage) return;
    } catch {
      return;
    }
    document.documentElement.dataset.crt = event.newValue === 'off' ? 'off' : 'on';
    notify();
  };
  window.addEventListener(CRT_CHANGE_EVENT, notify);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CRT_CHANGE_EVENT, notify);
    window.removeEventListener('storage', onStorage);
  };
};
```

- [ ] Renderizar botao nativo e inserir `<li><CrtToggle /></li>` imediatamente depois de `li.site-startmenu-sep`, antes do link Bonzi. Importar `PixelIcon` de `@/components/win98/PixelIcon` e a chave do arquivo bootstrap. Manter o menu aberto e o label constante:

```tsx
<button type="button" className="crt-toggle" aria-pressed={enabled} onClick={toggle}>
  <PixelIcon src="/icons/computador.svg" size={24} />
  <span>Monitor CRT</span>
  <span className="crt-toggle-state" aria-hidden="true">
    {enabled ? 'Ligado' : 'Desligado'}
  </span>
</button>
```

- [ ] No layout, importar `crtBootstrap`, adicionar `data-crt="on"` ao html e `<script dangerouslySetInnerHTML={{ __html: crtBootstrap }} />` ao head, preservando `suppressHydrationWarning` e scripts existentes. Nao mudar metadata, fontes ou provider. Adiar import de CSS ate o arquivo existir na Task 3.
- [ ] Expandir os testes de preferencia conforme a tabela. Escrever cada caso antes do eventual ajuste que ele exige. Nao depender da ordem entre testes.

| Caso                | Preparacao concreta                                                                                                                 | Assertiva                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Persistencia on/off | Clicar duas vezes e reload; ler localStorage real                                                                                   | Dataset e aria-pressed acompanham ambos os valores.                        |
| Corrompido/ausente  | `page.addInitScript` salva `broken` ou remove a chave antes de goto                                                                 | Default on, sem erro.                                                      |
| Storage bloqueado   | `addInitScript` substitui `Storage.prototype.getItem` e `setItem` por funcoes que lancam `DOMException('Blocked', 'SecurityError')` | Default on; toggle off funciona na aba; reload volta on; nenhum pageerror. |
| Duas abas           | `context.newPage()` no mesmo contexto/origem; clicar toggle na primeira                                                             | Segunda atualiza dataset e aria-pressed, sem reload.                       |
| Clear/invalido      | Primeira aba executa `localStorage.clear()` ou grava `broken`                                                                       | Segunda retorna on; chave nao relacionada nao muda CRT.                    |
| Evento local        | Clicar com menu aberto                                                                                                              | DOM muda de imediato; button permanece focado e nome nao muda.             |

- [ ] Executar `npm run build`, depois `npm run test:e2e -- tests/crt.spec.ts`. Nesta etapa, testes de preferencia devem passar; o teste de overlay continua RED ate Task 3. Nao declarar a suite completa verde prematuramente.

## Task 3: Camadas Estaticas, Integracao de Boot e Acessibilidade

**Files:** criar `src/styles/crt.css`; modificar `src/app/layout.tsx` e `src/components/boot/BootScreen.tsx`; expandir `tests/crt.spec.ts`.

- [ ] Criar CSS com variaveis locais e valores iniciais da especificacao. Base da camada:

```css
.crt-overlay {
  --crt-scanline: 0.11;
  --crt-rgb: 0.045;
  --crt-vignette: 0.17;
  --crt-glass: 0.025;
  position: fixed;
  inset: 0;
  z-index: 203;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgb(255 255 255 / var(--crt-glass)), transparent 45%),
    radial-gradient(ellipse at center, transparent 50%, rgb(0 0 0 / var(--crt-vignette)) 100%);
}
.crt-overlay::before,
.crt-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.crt-overlay::before {
  background: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    rgb(0 0 0 / var(--crt-scanline)) 2px 3px
  );
}
.crt-overlay::after {
  background: repeating-linear-gradient(
    to right,
    rgb(255 0 0 / var(--crt-rgb)) 0 1px,
    rgb(0 255 0 / var(--crt-rgb)) 1px 2px,
    rgb(0 0 255 / var(--crt-rgb)) 2px 3px
  );
}
html[data-crt='off'] .crt-overlay {
  display: none;
}
.site-skip:focus {
  z-index: 204;
}
@media (max-width: 640px), (pointer: coarse) {
  .crt-overlay {
    --crt-scanline: 0.075;
    --crt-rgb: 0.025;
    --crt-vignette: 0.12;
    --crt-glass: 0.015;
  }
}
@media (forced-colors: active) {
  .crt-overlay {
    display: none;
  }
}
@media print {
  .crt-overlay {
    display: none;
  }
}
```

- [ ] Acrescentar CSS local para `.crt-toggle`: `display:flex`, `align-items:center`, `gap:inherit`, `flex:1`, `align-self:stretch`, `min-width:0`, `min-height:44px`, `padding:0`, `border:0`, `background:none`, `font:inherit`, `color:inherit`, `text-align:left`, `cursor:pointer`. Usar `.crt-toggle:focus-visible` com outline pontilhado de 1px e outline-offset 1px; `.crt-toggle-state` com `margin-left:auto` e fonte compacta. Aproveitar `li:focus-within` existente; verificar 320px antes de aumentar espacos. Nao alterar `.w98-btn` ou bundle global.
- [ ] Importar `@/styles/crt.css` apos os estilos existentes no layout. Inserir `<div className="crt-overlay" aria-hidden="true" />` como filho direto do body apos BootScreen e como ultimo filho do dialog em BootScreen. Nenhum novo componente overlay e necessario. Nao colocar dentro de OsProvider nem alterar fases, skip ou timers.
- [ ] Adicionar testes concretos de prepaint e camadas. Para prepaint, persistir off em pagina ja hidratada antes de bloquear somente `**/_next/**/*.js`; inline nao pode ser bloqueado. Modelo:

```ts
await page.evaluate(() => localStorage.setItem('setac2:crt', 'off'));
await page.route('**/_next/**/*.js', (route) => route.abort());
await page.reload({ waitUntil: 'domcontentloaded' });
await expect(page.locator('html')).toHaveAttribute('data-crt', 'off');
await expect(page.locator('body > .crt-overlay')).toHaveCSS('display', 'none');
```

- [ ] Verificar o DOM contem exatamente duas `.crt-overlay`, ambas `aria-hidden=true`, sem tabindex. A do body deve cobrir a viewport; off esconde ambas por computed display. No teste de boot, instalar `page.clock.install()` antes de goto, usar `reducedMotion: 'no-preference'` e sessionStorage limpo, esperar `.boot-screen[open]`; afirmar `dialog.matches(':modal')`, existencia/visibilidade da camada interna e cobertura de viewport. Clicar `Pular abertura` e verificar fechamento sem pageerror. Nao usar somente z-index para afirmar que a top layer esta coberta.
- [ ] Parametrizar teclado/mobile em 1440x900, 390x844 e 320x568. Abrir Iniciar; navegar com Tab ate o botao; Space e Enter alternam `aria-pressed`; foco continua visivel. Criar ao menos um contexto com `isMobile: true, hasTouch: true` e usar `tap()`. Verificar botao em viewport, alvo de 44px e menu sem overflow horizontal novo; navegar pelo link real de programacao depois de alternar.
- [ ] Parametrizar `page.emulateMedia({ forcedColors: 'active' })` e `{ media: 'print' }`, verificando display none das duas camadas. Retornar para midia normal e confirmar efeito reaparece se dataset on. Checar computed `animationName === 'none'` e `transitionDuration === '0s'` da camada e `::before`/`::after`, com e sem reduced motion. Focar `.site-skip` e confirmar z-index maior que camada, sem cancelar sua navegacao.
- [ ] Adicionar teste de geometria: abrir o link de programacao usando `getByRole('link', { name: /^Programa.*\.exe$/ })`, escopado na navegacao da area de trabalho; o nome real tem acento. Medir `.os-frame`, alternar CRT pelo menu e fechar menu com Iniciar; boundingBox permanece igual com tolerancia de 1px. Arrastar pela `.w98-titlebar` (seletor confirmado em `Window.tsx`), verificar delta real e toggle sem novo deslocamento. Maximizar com `getByRole('button', { name: 'Maximizar', exact: true })`, medir limites incluindo taskbar, alternar CRT e confirmar medidas iguais; restaurar e confirmar caixa anterior. Nao inventar comportamento de drag em mobile se o OS o desabilita.
- [ ] Capturar `pageerror` e console error contendo hidratacao em todos os testes, usando arrays por teste, nao compartilhados entre contextos. Depois executar `npm run build` e `npm run test:e2e -- tests/crt.spec.ts`. Esperado: todos os casos verdes. Resolver falhas reais antes de avaliar screenshots.

## Task 4: Capturas Pareadas e Ajuste Visual

**Files:** criar `tests/crt-visual.spec.ts`; ajustar apenas valores locais em `src/styles/crt.css` se necessario. Artefatos: `test-results/crt/visual/`.

- [ ] Criar testes para home e programacao em 1440x900, 1920x1080, 390x844 e 320x568, cada um em `deviceScaleFactor` 1 e 2. Como DPR e configuracao de contexto, usar `test.describe` com `test.use({ viewport, deviceScaleFactor })`, nao somente `setViewportSize`. Nomes dos testes/arquivos incluem rota, largura, altura e DPR para nao sobrescrever.
- [ ] Preparar cada cena: `page.clock.setFixedTime(new Date('2026-10-01T12:00:00Z'))`, reduced motion reduce, goto, `await page.evaluate(() => document.fonts.ready)`, aguardar imagens visiveis com `complete && naturalWidth > 0`. Injetar CSS de teste `*, *::before, *::after { animation: none !important; transition: none !important; }`; nao usar isso como prova de ausencia de animacao na producao. Mover mouse para canto neutro. No desktop programacao, esperar a janela/conteudo, nao URL fixa por causa de OsProvider.
- [ ] Abrir Iniciar para compor a cena, usar o toggle real para off/on, mantendo viewport, janelas, scroll e menu identicos. Capturar com `animations: 'disabled'`, `caret: 'hide'`, `scale: 'device'`. Adicionar cena sem menu para texto denso e janela maximizada. A variante forte altera apenas variaveis locais pelo teste:

```ts
const strongStyle = await page.addStyleTag({
  content: `
  .crt-overlay {
    --crt-scanline: 0.24;
    --crt-rgb: 0.10;
    --crt-vignette: 0.30;
  }
`,
});
await page.screenshot({ path: `${prefix}-strong.png`, animations: 'disabled', caret: 'hide' });
await strongStyle.evaluate((node) => node.remove());
```

- [ ] Usar `node:fs/promises` e `node:path` apenas no teste visual para preparar artefatos e HTML. Diretorio deve existir antes de screenshot. Cada teste escreve pagina propria com arquivos relativos; nao compartilhar um HTML mutavel entre testes. Exemplo de API:

```ts
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.resolve('test-results/crt/visual');
await mkdir(dir, { recursive: true });
// stem e uma string derivada de rota, viewport, DPR e cena deste teste.
const prefix = path.join(dir, stem);
const variants = ['off', 'on', 'strong'];
await writeFile(
  `${prefix}.html`,
  `<!doctype html><html lang="pt-BR">
<meta charset="utf-8"><title>CRT ${stem}</title>
<style>body{font:14px sans-serif}section{display:flex;gap:16px;overflow:auto}
figure{margin:0;flex:none}img{display:block;max-width:480px;height:auto}
.detail img{max-width:none;image-rendering:pixelated}</style>
<h1>${stem}</h1><section>${variants
    .map(
      (variant) =>
        `<figure><figcaption>${variant}</figcaption><img src="${stem}-${variant}.png" alt="${variant}"></figure>`,
    )
    .join('')}</section></html>`,
);
```

- [ ] Produzir recortes adicionais com `page.screenshot({ clip, scale: 'device' })`: selecionar caixa de um bloco de texto pequeno da programacao e clamp do clip dentro da viewport. Manter exatamente o mesmo clip nas tres variantes. Incluir essas imagens no HTML em secao `.detail`, com ampliacao inteira 2x/4x via tamanho CSS calculado a partir das dimensoes do recorte, sem reamostragem fracionaria. Esperar todas as tres capturas antes de escrever o comparativo. Gerar tambem captura do boot em contexto limpo com reduced motion `no-preference`: instalar clock antes de goto, esperar o dialog aberto, executar `await page.clock.runFor(1900)` e esperar `data-phase='splash'` antes da captura. Nao injetar o CSS de congelamento global nessa cena; para comparar off/on em splash, alterar dataset e disparar `setac:crt-change` somente nesse teste, pois o menu atras do dialog e inert.
- [ ] Executar `npm run test:e2e -- tests/crt-visual.spec.ts`. Esperado: PNGs pareados, recortes e HTML por cena, sem alterar producao. Abrir as imagens com a ferramenta de leitura de imagens e inspecionar o HTML pelo navegador disponivel ao agente; se nao houver controle de navegador, ler diretamente todos os pares e recortes, registrando a limitacao de preview do HTML.
- [ ] Avaliar concretamente texto pequeno, acentos/horarios da programacao, foco do menu, barra de tarefas, vinheta nos controles de canto e padrao/moire em DPR 2. Forte e somente comparacao negativa de legibilidade, nao candidato automatico ao bundle. Manter on discreto; reduzir RGB primeiro se texto ganha franjas, scanline se tracos finos desaparecem, vinheta se cantos escurecem demais. Nao compensar com blur, aumentar fontes globalmente ou cortar bordas.
- [ ] Se ajustar CSS, registrar os numeros finais e motivo na especificacao com `apply_patch`, reconstruir com `npm run build`, repetir `npm run test:e2e -- tests/crt.spec.ts tests/crt-visual.spec.ts` e inspecionar os novos artefatos. Nao aceitar screenshots antigas de um build anterior como evidencia da versao final.

## Task 5: Verificacao Final e Entrega

**Files:** revisar todos os arquivos do mapa e os dois documentos. Nenhum commit.

- [ ] Executar `npm run lint`. Esperado: sem erros novos; analisar qualquer warning em vez de desativar regra.
- [ ] Executar `npm run typecheck`. Esperado: typegen/tsc aprovados.
- [ ] Executar `npm run format:check`. Esperado: arquivos formatados. Se necessario, aplicar Prettier somente aos arquivos alterados, por exemplo `npx prettier --write src/components/crt/bootstrap.ts src/components/crt/CrtToggle.tsx src/styles/crt.css src/app/layout.tsx src/components/win98/StartMenu.tsx src/components/boot/BootScreen.tsx tests/crt.spec.ts tests/crt-visual.spec.ts docs/superpowers/specs/2026-10-01-crt-monitor-design.md docs/superpowers/plans/2026-10-01-crt-monitor.md`, e repetir a verificacao; nao rodar format global que reescreva arquivos alheios.
- [ ] Executar `npm run test:bonzi`. Esperado: testes de engine existentes aprovados.
- [ ] Executar `npm run build` depois de qualquer alteracao final de producao. Esperado: build de producao aprovado.
- [ ] Executar `npm run test:e2e -- tests/bonzi.spec.ts`. Esperado: comportamento existente do Bonzi, menu e rotas preservado.
- [ ] Executar `npm run test:e2e`. Esperado: suite completa incluindo CRT, visual e Bonzi aprovada; executar com servidor configurado e build atualizado, nao reaproveitar servidor dev.
- [ ] Revisar `git diff --check`, `git diff --stat` e `git status --short` individualmente. Conferir arquivos novos com Read, pois `git diff` nao mostra untracked. Garantir ausencia de modificacoes no engine/config, assets gerados em producao e CSS forte entregue. O unico ajuste permitido no teste Bonzi e o seletor documentado no registro de execucao. Nao executar git add/commit.
- [ ] Relatar ao usuario em portugues: comportamento entregue, valores finais, comandos e resultados reais, diretorio/arquivos de comparacao visual e limitacoes verificadas. Se um comando nao puder executar, indicar impedimento e nao afirmar que passou. Nao solicitar uma aprovacao adicional.

## Auto-Revisao do Plano

- [x] Pesquisa tem URLs reais, secoes identificadas e distingue achados historicos de decisoes esteticas.
- [x] Contratos `CRT_STORAGE_KEY`, `crtBootstrap`, `CrtToggle`, `data-crt`, `setac:crt-change` e valores on/off sao consistentes entre tarefas.
- [x] O fluxo RED usa build atual e falha por ausencia da feature; suites de producao exigem rebuild apos alteracao.
- [x] Top layer recebe camada propria; forced colors/print atingem ambas; screensaver nao recebe overlay.
- [x] Preferencia, teclado/touch, pre-hidratacao, storage bloqueado/corrompido/clear, cross-tab e geometria possuem verificacoes explicitadas.
- [x] Capturas incluem desktop/mobile, programacao, DPR 2, off/on/forte, recortes e iteracao; CSS forte nao vai para producao.
- [x] Sem gates de aprovacao ou commits; esta fase fica restrita a documentacao.

Os checks desta secao revisam o plano, nao significam que implementacao ou testes ja foram executados. O agente principal pode iniciar a Task 1 diretamente.

## Ajuste Encontrado Durante Execucao

A inspecao da primeira matriz encontrou luz RGB indevida sobre regioes pretas. Foi acrescentado um teste real de screenshot em `tests/crt.spec.ts`: um patch preto abaixo da camada deve ter variacao maxima de 1 nivel entre canais e nenhum canal acima de 3. O teste falhou inicialmente com variacao 11. A correcao minima e `mix-blend-mode: multiply` na camada inteira e reducao das intensidades conforme os valores finais registrados na especificacao. Repetir build, teste de regressao, matriz de capturas e verificacoes finais com esta composicao.

A primeira suite completa passou 31 de 32 casos. O caso antigo de reabertura do Bonzi usava `expect(page.locator('.os-frame')).toBeVisible()` quando Inscricao.txt e Programacao.exe ja estavam abertas. A falha foi strict mode por duas correspondencias, nao falha do CRT. Corrigir somente o seletor para `.os-frame[data-key="programacao"]`, preservando a intencao de validar a janela recem-aberta e todas as demais assertivas. O documento preexistente `docs/superpowers/plans/2026-10-01-minicurso-gj.md` tem pendencia no format check global; nao reformata-lo como parte deste trabalho.

## Resultado da Execucao

- [x] Pesquisa e design registrados; decisoes delegadas pelo usuario.
- [x] RED confirmado antes da implementacao, incluindo regressao de preto iluminado.
- [x] Bootstrap, controle acessivel e duas camadas estaticas implementados.
- [x] Primeira matriz inspecionada; composicao e intensidade corrigidas; segunda matriz aceita em desktop/mobile, DPR 1 e 2.
- [x] HTML comparativo aberto e imagens verificadas pelo Chrome; execucao filtrada do teste visual passou depois de remover dependencia entre casos.
- [x] Build final, typecheck e lint aprovados; 32 testes e2e e 9 testes unitarios do Bonzi passaram.
- [x] Formatacao de todos os arquivos alterados e `git diff --check` aprovados. Check global de formatacao registra somente a pendencia preexistente mencionada acima.
- [x] Alteracoes mantidas no workspace sem commit, push ou mudancas de configuracao/dependencias.

Capturas e comparativos finais: `test-results/crt/visual/index.html`. Sao artefatos ignorados pelo Git e regenerados pelos testes visuais, nao arquivos de producao nem baselines automaticas.
