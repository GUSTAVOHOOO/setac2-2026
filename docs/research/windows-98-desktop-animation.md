# Entrada do desktop após o boot: referência Windows 98

Pesquisa em 29/09/2026. Complementa `windows-98-boot.md`.

## O que as fontes sustentam

- A Microsoft descreve `DrawAnimatedRects` / `IDANI_CAPTION` como animação entre os retângulos de origem e destino da legenda de uma janela, associada a abrir um ícone, minimizar ou maximizar. A documentação MFC também descreve o desenho de um contorno retangular. Isso fundamenta uma abertura curta por contorno/título, seguida da exibição do conteúdo. [Microsoft: DrawAnimatedRects](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-drawanimatedrects), [Microsoft: CWnd::DrawAnimatedRects](https://learn.microsoft.com/en-us/cpp/mfc/reference/cwnd-class#drawanimatedrects).
- Há evidência contemporânea de menus que se desdobravam/deslizavam no estilo Windows 98: o estudo experimental de Wong e Seltzer, publicado no USENIX em 1999, descreve esses efeitos e mede seu custo na comunicação de uma sessão remota. É pesquisa primária, mas seu objeto é Terminal Server; não é uma especificação do boot do Windows 98. [Artigo, seção 3.3.2](https://static.usenix.org/publications/library/proceedings/usenix-nt99/full_papers/wong/wong_html/index.html).
- `AnimateWindow` distingue roll, slide, expansão/recolhimento e fade; a documentação Microsoft dá 200 ms como duração típica. A página atual informa Windows 2000 como cliente mínimo suportado e, por isso, **não comprova a data de introdução de cada efeito**. [Microsoft: AnimateWindow](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-animatewindow).
- A documentação do próprio fabricante do ComponentOne List 8.0 diferencia seus efeitos roll/slide no Windows 98 do blend, disponível apenas em NT 5.0. É evidência primária sobre esse componente, não prova isolada de toda a implementação do shell. Reforça a decisão visual de evitar fades translúcidos nesta recriação. [GrapeCity: AnimateWindow Property](https://help.grapecity.com/componentone/NetHelp/truedblist8/animatewindowproperty.html).

## Limites da fidelidade

Não foi encontrada, nas fontes primárias consultadas, uma coreografia universal de ícones aparecendo um a um durante a inicialização do Explorer. Portanto, o escalonamento de barra, ícones e janelas é uma **adaptação artística para o site**. A fidelidade está no vocabulário visual: pintura direta, recortes, contornos retangulares e movimentos breves. Tempos exatos e quantidade de passos também são decisões deste projeto, sem pretensão de emular um computador específico.

## Escolha de biblioteca

| Critério             | Anime.js v4                                              | GSAP                                             |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| Sequência controlada | `createTimeline()`; posições na linha do tempo           | `gsap.timeline()`; posições na linha do tempo    |
| Movimento em saltos  | `steps(n)` importado, usado em `ease`                    | `ease: "steps(n)"`                               |
| Pintura instantânea  | `timeline.set()` em uma posição definida                 | Métodos da timeline permitem orquestrar estados  |
| Limpeza              | `timeline.revert()` cancela e restaura valores e estilos | Também viável; não é necessário instalar as duas |

Fontes oficiais: [Anime.js Timeline](https://animejs.com/documentation/timeline/), [Steps easing](https://animejs.com/documentation/easings/steps-easing/), [set](https://animejs.com/documentation/timeline/timeline-methods/set/), [revert](https://animejs.com/documentation/timeline/timeline-methods/revert/), [GSAP Timeline](<https://gsap.com/docs/v3/GSAP/gsap.timeline()/>), [GSAP SteppedEase](https://gsap.com/docs/v3/Eases/SteppedEase/).

**Recomendação:** Anime.js v4. As duas atendem ao efeito; Anime.js oferece diretamente a pequena sequência necessária e foi a referência indicada pelo usuário. A escolha não depende de benchmark ou de alegação de desempenho superior.

## Roteiro de implementação recomendado

1. Após o splash, mostrar o fundo do desktop.
2. Revelar a barra e pintar os ícones em pequenos intervalos, sem elasticidade ou transparência gradual.
3. Abrir as janelas principais com contorno/título crescendo em poucos passos, então mostrar a janela completa.
4. Manter a entrada inteira curta, aproximadamente 1–1,5 s. Esse tempo é uma escolha de experiência para a SETAC².
5. Executar somente ao concluir naturalmente a primeira abertura da sessão. Pular, Esc, preferência por movimento reduzido e visitas seguintes devem entregar o desktop pronto.
6. Cancelar a timeline e restaurar elementos ao desmontar, interromper ou redimensionar. A interface deve permanecer utilizável se a biblioteca não carregar.

Os itens deste roteiro são decisões de design e implementação, não afirmações históricas adicionais.
