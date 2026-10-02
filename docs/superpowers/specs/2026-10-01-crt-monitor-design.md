# Monitor CRT: Pesquisa e Design

Data: 2026-10-01. Aplicacao: `site`. Documento de especificacao, nao registro de uma implementacao concluida.

## Objetivo

Evocar um monitor CRT de computador dos anos 1990 sobre a interface Windows 98 existente, preservando leitura, navegacao, geometria das janelas e desempenho. O efeito comeca ligado, pode ser desligado no menu Iniciar e respeita a preferencia persistida antes da primeira pintura.

O usuario delegou as decisoes ao agente. Pesquisa, implementacao, capturas, comparacao e ajuste devem prosseguir sem pedidos de aprovacao. Nao criar commits, pois nao foram solicitados. Esta etapa altera somente esta especificacao e o plano associado; codigo, testes e comandos de build ficam para o agente implementador.

## Pesquisa Consultada

Fontes acessadas em 2026-10-01. As conclusoes abaixo sao sinteses, nao reproducao extensa dos textos. O FAQ e historico: comentarios sobre tecnologia dominante e precos descrevem sua epoca, nao o mercado atual. Os artigos da Wikipedia sao fontes secundarias; o de shadow mask sinaliza lacunas de citacao. Nenhuma fonte prescreve as opacidades CSS escolhidas aqui.

| Fonte                                                                                                                                                          | Evidencia relevante                                                                                                                                                                                                                   | Consequencia para o projeto                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Samuel M. Goldwasser, _TV and Monitor CRT (Picture Tube) Information_, secao **Color CRT Resolution - Focus and Dot/Slot/Line Pitch** e discussao de resolucao | Detalhe depende de sinal, largura de banda, foco e pitch. Triades de fosforo nao correspondem aos pixels logicos da imagem, nem precisam estar alinhadas a eles. Dot mask, slot mask e aperture grille possuem estruturas diferentes. | A textura CSS sugere fosforo; nao transforma o site em uma grade de pixels nem afirma reproduzir fisicamente um tubo especifico.                                         |
| Mesmo FAQ, **About the Quality of Monitor Focus**                                                                                                              | A distancia e o angulo do feixe variam entre centro e cantos; foco dinamico compensa essas diferencas.                                                                                                                                | Nao usar desfoque global como sinonimo de autenticidade. Preservar a tipografia pequena do site.                                                                         |
| Mesmo FAQ, **Flat Versus Non-Flat CRTs**                                                                                                                       | Curvatura, correcao geometrica e uniformidade de brilho variam. Trinitron historicamente tem curvatura diferente nas duas direcoes.                                                                                                   | Sugerir vidro e queda de brilho nos cantos, sem deformar DOM, cortar conteudo ou arredondar a area util.                                                                 |
| Mesmo FAQ, **Why do TVs Overscan?**                                                                                                                            | Monitores de computador normalmente sao ajustados sem overscan para mostrar a imagem inteira.                                                                                                                                         | Nao cortar bordas, barra de tarefas, controles ou janelas para simular televisao.                                                                                        |
| Mesmo FAQ, **Color CRT Construction**                                                                                                                          | Convergencia alinha geometricamente as tres cores; convergencia ruim produz franjas coloridas em texto e graficos.                                                                                                                    | Separacao RGB forte representa um defeito, nao a apresentacao padrao de um PC bem ajustado.                                                                              |
| Wikipedia, _Computer monitor_, **Cathode ray tube**, **Aspect ratio** e **Resolution**                                                                         | CRTs dominaram monitores de PC durante os anos 1990; 4:3 era comum. Resolucao aumentou ao longo da decada, chegando a 1024x768 no fim dela.                                                                                           | 640x480, 800x600 e 1024x768 sao referencias contextuais de modos de video da epoca, nao uma resolucao nativa fixa de todo CRT nem limites impostos ao layout responsivo. |
| Wikipedia, _Shadow mask_                                                                                                                                       | Mascaras perfuradas selecionam fosforos RGB finos, frequentemente em triades; aperture grille/Trinitron e uma abordagem distinta, com faixas.                                                                                         | Uma textura RGB vertical discreta e uma aproximacao visual barata, nao uma replica exata de shadow mask triangular nem uma simulacao certificada de Trinitron.           |

URLs:

- https://www.repairfaq.org/sam/crtfaq.htm
- https://en.wikipedia.org/wiki/Computer_monitor
- https://en.wikipedia.org/wiki/Shadow_mask

Conclusao de design: monitor de PC colorido, estavel e bem ajustado. Ruido VHS forte, tracking, wobble, cromas deslocados, flicker e cropping nao fazem parte do padrao. Scanlines estaticas tambem sao uma simplificacao artistica: sua visibilidade real depende do modo de video e do tubo. O periodo de 3px CSS e uma escolha de interface, nao uma medida fisica de dot pitch.

## Contexto Verificado

- Next.js 16.3.7, React 19.2.8, TypeScript e CSS global; Playwright 1.63.0 usa Chrome, uma worker e servidor de producao na porta 3178.
- `src/app/layout.tsx` ja utiliza scripts inline de bootstrap no `head`, `suppressHydrationWarning` no `html`, `OsProvider`, `Taskbar`, `Motion`, `Screensaver` e `BootScreen`.
- `src/components/boot/BootScreen.tsx` chama `showModal()`: seu `dialog` pertence a top layer, acima de qualquer z-index do documento comum.
- `src/components/win98/StartMenu.tsx` contem `ul.w98-menu`, um separador e o atalho BonziBuddy. O toggle entra imediatamente depois do separador, antes de BonziBuddy.
- `public/icons/computador.svg` existe e `PixelIcon` aceita `src` e `size={24}`. O CSS existente reduz icones de menu para 16px; preservar esse comportamento.
- `--z-taskbar` vale 200. Motion usa 202; screensaver usa 210. O skip link hoje usa 201 e deve subir no foco.
- `site.css` estiliza `li > a`, nao botoes equivalentes. Estilos do novo botao ficam em `crt.css`, sem reescrever o bundle Win98.
- A suite existente e `tests/bonzi.spec.ts`. `npm run test:e2e` nao faz build: o servidor configurado exige um build de producao atualizado.

## Arquitetura

### Bootstrap Antes da Pintura

Criar `src/components/crt/bootstrap.ts`, sem dependencia de React ou acesso a APIs de navegador no escopo de importacao. Exportar `CRT_STORAGE_KEY = 'setac2:crt'` e a string `crtBootstrap`.

O script le `localStorage` em `try/catch` e define `document.documentElement.dataset.crt` como `off` somente para o valor literal `off`; `on`, ausencia, string invalida ou armazenamento bloqueado resultam em `on`. Persistir valores simples `on`/`off`, sem JSON, migracao ou provider.

No layout, importar esse bootstrap e `@/styles/crt.css`, manter os scripts existentes e acrescentar o script inline de CRT no `head`. Declarar `data-crt="on"` no `html` como fallback sem JavaScript, mantendo o `suppressHydrationWarning` existente. O script prepaint corrige para `off` antes de pintar quando a preferencia foi salva.

### Toggle Client Minimo

Criar `src/components/crt/CrtToggle.tsx` com `'use client'`, `useSyncExternalStore` e `PixelIcon`. Exportar `CrtToggle`, sem props obrigatorias. Snapshot client booleano: `document.documentElement.dataset.crt !== 'off'`. Snapshot do servidor: `true`.

Assinar `setac:crt-change` para alteracoes na mesma aba e o evento nativo `storage` para outras abas. No evento de storage, aceitar somente a chave CRT ou `key === null` (clear), ignorar eventos de sessionStorage e normalizar `newValue` pela mesma regra do bootstrap. Atualizar o dataset antes de notificar React. Remover ambos os listeners na limpeza. Nao adicionar polling nem MutationObserver.

Ao clicar, calcular o proximo estado a partir do dataset atual, escrever primeiro o dataset, tentar persistir com `localStorage.setItem` protegido e disparar `setac:crt-change` mesmo se a persistencia falhar. Isso mantem a aba funcional em navegadores que bloqueiam armazenamento. Nessas condicoes, reload volta ao default ligado; nao prometer persistencia impossivel.

Renderizar `button type="button"`, `aria-pressed={enabled}`, classe `crt-toggle`, icone decorativo `/icons/computador.svg` e label constante `Monitor CRT`. Pode haver um marcador visual `Ligado`/`Desligado` com `aria-hidden="true"`, mantendo o nome acessivel estavel. Preservar a semantica nativa de Space/Enter, sem `role="switch"` ou `role="menuitem"` sobre a navegacao existente. O clique nao navega nem fecha o menu: permite perceber e reverter a escolha, preservando foco no botao.

Adicionar import e `<li><CrtToggle /></li>` ao StartMenu. Nao criar provider, painel de configuracoes, rota ou dependencias.

### Camadas Decorativas

Criar `src/styles/crt.css`. Usar o mesmo `<div className="crt-overlay" aria-hidden="true" />` em dois lugares: filho direto de `body`, apos `BootScreen`, e ultimo filho dentro do dialog de `BootScreen`. O segundo e indispensavel para cobertura da top layer. A camada do body fica atras do dialog opaco; as duas nao devem dobrar a intensidade da abertura.

Cada camada tem `position: fixed; inset: 0; z-index: 203; pointer-events: none`. Nao tem tabindex, texto acessivel, listeners, imagens ou animacoes. Base com gradientes de vidro/vinheta; `::before` com scanlines; `::after` com textura RGB. Pseudo-elementos tambem sao pointer-inert. `html[data-crt='off'] .crt-overlay { display: none; }` remove a pintura quando desligado.

Nao criar camada no screensaver. Ele permanece acima da camada do body em 210; nao mudar sua composicao ou seu comportamento. Promover apenas `.site-skip:focus` para 204, acima do CRT. O botao de pular abertura continua clicavel por causa de `pointer-events: none`; nao alterar timers ou fases do boot.

### Valores Iniciais

| Parametro        | Desktop                                                              | Mobile/coarse       |
| ---------------- | -------------------------------------------------------------------- | ------------------- |
| Scanline         | 1px escuro por periodo de 3px; alpha 0.11, faixa de ajuste 0.10-0.12 | Alpha inicial 0.075 |
| RGB              | Tres faixas de 1px por periodo de 3px; alpha 0.045, faixa 0.04-0.055 | Alpha inicial 0.025 |
| Vinheta          | Centro transparente; canto com alpha 0.17, faixa 0.14-0.20           | Alpha inicial 0.12  |
| Reflexo de vidro | Branco muito discreto, alpha maximo 0.025                            | Alpha maximo 0.015  |

Usar variaveis CSS na propria `.crt-overlay`, para ajustes e experimento visual sem APIs extras. Reduzir intensidade em `@media (max-width: 640px), (pointer: coarse)`. Os valores sao pontos de partida sujeitos a capturas; legibilidade decide o ajuste final. Nao adicionar filtro global, blur, text-shadow RGB em todo o texto, transform, border-radius do conteudo, canvas/WebGL, animacao temporal ou restricao 4:3. A composicao final usa `mix-blend-mode: multiply` na camada decorativa para preservar fosforos nao iluminados em regioes pretas.

## Acessibilidade e Resiliencia

- `@media (forced-colors: active)` e `@media print` escondem todas as `.crt-overlay`, inclusive as do dialog. Nao usar `forced-color-adjust: none` para contornar a preferencia.
- Reduced motion nao precisa desligar uma textura estatica. Verificar que a camada e seus pseudo-elementos nao possuem animacoes ou transicoes, com e sem reduced motion.
- Garantir alvo de toque minimo de 44px para `.crt-toggle`, foco pontilhado visivel e cores herdadas do item Win98 selecionado. O menu inteiro deve continuar cabendo a 320x568.
- Nao mudar dimensoes, coordenadas de arrasto, limite inferior das janelas, barra de tarefas, scroll ou escala do desktop.
- Bootstrap, toggle e eventos nao podem gerar erros nao tratados quando localStorage lanca `SecurityError`.
- `aria-pressed` representa preferencia, nao pintura efetiva: em forced colors/print a preferencia pode estar ligada, mas a decoracao fica suprimida por CSS.

## Verificacao Obrigatoria

Criar `tests/crt.spec.ts` com testes reais de navegador para default ligado, toggle, persistencia apos reload, preferencia off antes da hidratacao, armazenamento bloqueado/corrompido, eventos de outras abas, clear, teclado, touch/mobile, reduced motion, forced colors, print, cobertura de boot e ausencia de interceptacao de pointer. Verificar geometria de janelas antes/depois de toggle, arrasto, maximizar/restaurar e limites da barra de tarefas.

Nao simular persistencia apenas mudando o DOM: a suite principal deve clicar no controle real. Para pre-hidratacao, salvar `off` em uma visita anterior, bloquear somente chunks JavaScript externos, recarregar com `waitUntil: 'domcontentloaded'` e verificar dataset e display da camada. Script inline deve continuar executando; nao desligar todo JavaScript. Capturar erros de pagina e mensagens de hidratacao.

Criar `tests/crt-visual.spec.ts` separadamente para capturas deterministicas off/on/forte na mesma cena. Matriz: 1440x900, 1920x1080, 390x844, 320x568 em DPR 1 e 2; home e `/programacao`. Em desktop, a rota direta de programacao pode virar home com janela aberta: verificar conteudo da programacao, nao exigir URL inalterada. Incluir menu aberto, texto denso, barra de tarefas, janelas e boot.

Fixar relogio, aguardar fontes/imagens, congelar movimento apenas nos testes e manter a geometria identica entre variantes. O experimento forte injeta CSS no teste, nunca no bundle entregue. Produzir HTML comparativo com imagens e recortes de texto no mesmo diretorio de artefatos. Inspecionar imagens reais, inclusive DPR 2, antes de escolher valores; testes passando nao demonstram qualidade visual.

Nao inventar limiares de pixel-diff de uma baseline inexistente. Produzir evidencias pareadas e promover snapshots somente depois de inspecionar a primeira execucao. Verificar menu a 320px, acentos, horarios e linhas pequenas da programacao, ausencia de moire agressivo e contraste nos cantos. Reduzir primeiro RGB, depois scanlines/vinheta se a leitura piorar. Repetir capturas e suite apos cada ajuste substancial.

## Criterios de Conclusao

- Preferencia deterministica antes da primeira pintura, toggle acessivel e funcional em todas as rotas, armazenamento resiliente e sincronizacao entre abas.
- CRT visivel mas secundario ao conteudo; nenhum efeito VHS forte ou alteracao geometrica.
- Boot coberto dentro da top layer, skip acessivel e screensaver preservado.
- Matriz visual inspecionada, intensidade final justificada e artefatos identificados no relato do implementador.
- Build atualizado, lint, typecheck, format check, suite Bonzi e e2e completo aprovados ou impedimentos explicitamente descritos com evidencia. Nenhum commit sem solicitacao.

## Auto-Revisao do Design

Cobertura: pesquisa distingue fosforo de pixel e CRT de VHS; arquitetura cobre prepaint, hidratacao, storage e top layer; verificacao cobre funcionamento, geometria, acessibilidade e comparacao visual. A camada nao transforma ancestrais, evitando quebrar fixed/drag. O snapshot SSR ligado pode aparecer brevemente no estado do botao durante hidratacao, mas a camada visual segue o dataset corrigido antes da pintura; nao e permitido flash da decoracao quando persistida off. Limite conhecido: a aproximacao CSS de 3px nao reproduz optica fisica e precisa ser avaliada em DPR 2. Nenhuma aprovacao adicional e necessaria.

## Iteracao Visual

As primeiras capturas reais mostraram uma grade colorida sobre o preto do terminal, mesmo na variante discreta. A composicao normal acrescentava luz RGB onde o sinal era preto. Um teste de regressao com um patch preto capturado pelo Chrome mediu variacao de 11 niveis entre canais (0-255), falhando contra o limite de 1.

A segunda versao troca a composicao da camada inteira para multiply. A textura modula a luz existente em vez de iluminar regioes pretas; o gradiente claro fica como alivio tonal sutil, nao como reflexo aditivo. Os valores foram reduzidos para priorizar leitura:

| Parametro   | Desktop final | Mobile/coarse final |
| ----------- | ------------- | ------------------- |
| Scanline    | 0.08          | 0.045               |
| RGB         | 0.045         | 0.02                |
| Vinheta     | 0.14          | 0.09                |
| Vidro tonal | 0.025         | 0.015               |

O experimento forte usa 0.24/0.10/0.30 apenas nos testes. Foi rejeitado como padrao por tornar a textura dominante. Os testes geram comparacoes de home, menu e programacao em quatro viewports, cada uma com DPR 1 e 2, alem da abertura. Artefatos em `test-results/crt/visual/index.html`; o teste visual regenera as imagens a cada execucao. Nao sao baselines de regressao visual aprovadas automaticamente.
