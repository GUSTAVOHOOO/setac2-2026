# BonziBuddy na Hero — pesquisa e proposta de implementação

Data: 29/09/2026. Status: proposta aprovada pelo usuário e implementada na branch `feat/bonzi-buddy`.

## Objetivo

Adicionar um atalho `BonziBuddy.exe` à área de ícones junto da Hero. Ao clicar, o gorila roxo aparece por cima do site, gesticula, passeia e fala em balões. A referência é o antigo companheiro de desktop; o escopo é um easter egg pequeno para a Setac².

## Abordagens

| Opção                                                   | Resultado                                            | Custo e limitação                                             |
| ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Sprite sheet + componente React (recomendada)           | Controle de poses, deslocamento, fala e encerramento | Requer conferir frames e procedência dos assets               |
| GIFs separados + deslocamento CSS                       | Protótipo visual rápido                              | Reinício e sincronização das animações são menos controláveis |
| Emular Microsoft Agent ou portar uma recriação completa | Mais funções do assistente                           | Complexidade desnecessária para esse easter egg               |

A proposta usa sprites locais e uma pequena máquina de estados. Não precisa de chat, IA, servidor de voz ou simulação do Windows além do que já existe no site.

## Pesquisa e preparação dos assets

O levantamento com fontes fica em [2026-09-29-bonzibuddy-research.md](../../research/2026-09-29-bonzibuddy-research.md).

Candidato concreto encontrado: `purple.png` do fork `TheRealKCFan20/BonziWORLD`, revisão `0635b420251c07a94f8c90158ffe9e19198246ad`, com 3400 × 3360 px e células de 200 × 160 px. O relatório registra links fixos e índices: neutro 0, pose de surf 9, entrada 277–302 e saída 16–38. Usar esses dados como ponto de partida para a inspeção visual, não como confirmação de que o asset já está pronto para publicação.

- [x] Selecionar o sheet candidato e registrar URL, revisão, autoria declarada e condições de uso. A licença do código de uma recriação não comprova a licença da arte original.
- [x] Baixar somente imagens e metadados necessários. Não executar instaladores antigos para obter as animações.
- [x] Conferir dimensões reais, transparência, tamanho de célula, contagem e ordem dos frames. Não copiar índices de outro sheet por semelhança visual.
- [x] Montar uma prévia das sequências de entrada, repouso, aceno, fala/gesto, movimento e saída. Inspecionar início, transições e retorno ao repouso.
- [x] Conferir se o arquivo possui animação de deslocamento. Quando só houver pose, deslocar a pose como adaptação web; não prometer um ciclo de caminhada inexistente.
- [x] Guardar o conjunto em `public/bonzi/` com `README.md` de procedência e `animations.json` contendo retângulos, duração e sequência. Gerar o ícone de 32 px a partir do mesmo conjunto visual, sem deformar a proporção.

Se a procedência não permitir concluir sobre reutilização, registrar essa pendência antes de publicar os assets. Uma arte alternativa precisa de uma decisão explícita, pois muda a fidelidade ao personagem pedido.

## Comportamento proposto

1. O atalho fica no grid ao lado do terminal, depois da Lixeira. Um clique, Enter ou Espaço ativa o personagem. É um botão com o estilo dos ícones existentes; não é um download `.exe`.
2. Carregar sprite e componente ao ativar. Exibir estado de carregamento no atalho; em falha, permitir tentar novamente sem bloquear a página.
3. Abrir apenas uma instância, perto do canto inferior direito, acima da barra de tarefas. Cliques repetidos no atalho fazem o personagem acenar, sem criar novas instâncias ou novos temporizadores.
4. Exibir a saudação e entrar em repouso. A cada 8–14 segundos de atividade visível, escolher uma ação: gesto ou deslocamento curto. Nunca executar duas ações simultâneas.
5. Deslocar entre posições dentro da viewport, durante 1,2–2 segundos, com pose apropriada. Limitar a região para caber sprite, balão e controles. Evitar os retângulos visíveis dos atalhos de inscrição e da barra de tarefas. Se não houver espaço, permanecer parado.
6. Emitir comentário espontâneo no máximo a cada 25–40 segundos. Clicar no personagem solicita uma fala e gesto; não acumular pedidos. O balão dura 6 segundos, com pausa enquanto tiver foco ou ponteiro sobre ele.
7. Manter controles visíveis de `Pausar`/`Continuar` e `Tchau, Bonzi`. Pausar congela deslocamento e ações autônomas. Dispensar encerra timers/animações e remove o personagem; o atalho pode reativá-lo.
8. Enquanto foco ou ponteiro estiverem no personagem, balão ou controles, suspender o passeio para que o alvo não fuja da interação. Voltar o foco ao atalho se o elemento focado for removido ao dispensar.
9. Em celular, usar o mesmo atalho e interação por toque, com personagem menor e deslocamentos curtos quando houver espaço. Sem arrastar nesta versão. Com movimento reduzido, usar pose estática e falas por clique, sem passeio ou gestos automáticos.
10. Suspender trabalho com a aba oculta; ao voltar, reagendar a próxima ação sem reproduzir uma fila acumulada. Recalcular limites no resize. Ao sair da home, desmontar tudo. Recarregar a página começa desativado.

Os intervalos acima são escolhas para o site, não uma reprodução de tempos históricos.

## Animações mínimas

| Estado lógico | Visual desejado                         | Transição                            |
| ------------- | --------------------------------------- | ------------------------------------ |
| `entering`    | Aparição ou aceno inicial               | Termina em `idle`                    |
| `idle`        | Pose neutra e piscar ocasional          | Agenda um gesto ou passeio           |
| `moving`      | Pose de deslocamento voltada ao destino | Termina em `idle`                    |
| `acting`      | Acenar, olhar ou gesto engraçado        | Uma sequência, depois `idle`         |
| `speaking`    | Gesto/pose com balão                    | Fecha após leitura e volta a `idle`  |
| `leaving`     | Despedida breve, quando disponível      | Desmonta e cancela todos os recursos |

O mapeamento usado está em `public/bonzi/animations.json` e no motor `engine.ts`. Entrada 277–302, pose de surf 9, gestos de apresentação 137–142, ombros 40–50, palmas 10–15 e saída 16–38. As sequências de gestos retornam à pose neutra. Não há sincronização labial.

## Falas

Escolha confirmada pelo usuário: balões em português com piadas de computação, sem som. As frases abaixo são novas para a Setac², não citações do Bonzi original:

- Entrada: “Oi! Sou o Bonzi. Vim pela Setac² e fiquei pelo Wi-Fi.”
- Clique: “Você clicou num macaco roxo. A curiosidade científica está em dia.”
- Repouso: “Compilando uma desculpa para tomar café...”
- Gesto: “Na minha máquina funciona. Na sua eu só passeio.”
- Passeio: “Fui dar uma volta enquanto o build termina.”
- Comentário: “Se aparecer um bug, finja que é uma demonstração.”
- Evento: “Uma inscrição por atividade. Até macaco lê o Leia-me.”
- Despedida: “Vou nessa. Salva o trabalho!”

Selecionar por contexto e evitar repetir a última frase. Dados do evento devem vir dos dados existentes ou ser omitidos das piadas para não duplicar informação que possa mudar.

Não incluir síntese de voz, arquivos de áudio ou controles de volume nesta versão.

## Integração no repositório atual

Inspeção: Next 16.3.7, React 19.2.8, TypeScript, CSS próprio e Anime.js já instalado. Antes de escrever código, seguir `AGENTS.md` e ler as seções pertinentes da documentação local do Next.

| Arquivo                                   | Responsabilidade planejada                                  |
| ----------------------------------------- | ----------------------------------------------------------- |
| `src/app/page.tsx`                        | Inserir o componente do atalho no `IconGrid` existente      |
| `src/components/bonzi/BonziLauncher.tsx`  | Botão cliente, carregamento e instância única               |
| `src/components/bonzi/BonziCompanion.tsx` | Sprite, balão, controles e portal no `document.body`        |
| `src/components/bonzi/useBonzi.ts`        | Estados, agendamento, cancelamento e limites de posição     |
| `src/components/bonzi/dialogue.ts`        | Falas locais por contexto                                   |
| `src/styles/bonzi.css`                    | Sprite, balão retrô, controles, mobile e movimento reduzido |
| `src/app/layout.tsx`                      | Importar a folha de estilos                                 |
| `public/bonzi/`                           | Imagens, manifesto de animações e procedência               |

`Hero.tsx` pode continuar como terminal: o atalho pertence à composição da Hero em `page.tsx`. `DesktopIcon` hoje é um link; não passar um href falso nem criar uma rota só para ativar o personagem. Reutilizar sua aparência no botão e manter a semântica de ação.

O portal evita que o sprite seja recortado ou deslocado junto com a janela arrastável. Usar camada com `z-index: 75`, acima de `.os-layer` (50), abaixo de menus (100) e da barra (200). O dialog de boot fica na top layer. A camada inteira usa `pointer-events: none`; apenas personagem e controles aceitam eventos. Não tornar o site inteiro uma região clicável.

Conferir a entrada do desktop: ela seleciona `.w98-icongrid > .w98-icon`, portanto o novo botão deve usar essa classe para aparecer junto com os demais. O personagem só nasce após interação e não entra automaticamente no boot.

## Etapas de execução e evidências de aceite

- [x] **Assets:** fechar a origem e o mapa de frames; conferir visualmente todas as sequências, inclusive transparência em fundo teal, branco e preto.
- [x] **Atalho e ciclo de vida:** ativar, carregar, reativar sem duplicação, dispensar e abrir novamente. Simular erro no carregamento e confirmar recuperação.
- [x] **Comportamento:** implementar os estados e limites acima. Validar que destinos cabem na área útil e não colidem com controles reservados; validar cancelamento em desmontagem e ausência de filas duplicadas.
- [x] **Falas e controles:** incluir a seleção contextual, pausa, despedida e acesso por teclado. Balões espontâneos não devem gerar anúncios contínuos em leitor de tela; uma fala solicitada por clique pode usar anúncio educado.
- [x] **Integração visual:** verificar em 1440×900, 390×844 e 320×568; abrir janelas, iniciar inscrição, usar Iniciar, rolar e redimensionar com o personagem ativo. Conferir que o botão fechar fica acessível.
- [x] **Preferências e limpeza:** conferir movimento reduzido inicial e alterado durante a sessão; ocultar/retomar aba; sair da home; fechar durante deslocamento; repetir ativação dez vezes sem instâncias ou timers acumulados.
- [x] **Qualidade:** executar `npm run lint`, `npm run typecheck`, `npm run build` e `git diff --check`, e revisar console e rede no navegador. O projeto não tem script de testes hoje; escolher um teste focado para limites/cancelamento ao implementar, sem fingir que lint prova o comportamento.
- [x] **Entrega:** atualizar README com uso e créditos; registrar verificações realmente realizadas. A simples existência desta proposta não comprova implementação.

## Verificação da implementação

- Nove testes unitários do motor aprovados: posição, percurso sem cruzar áreas reservadas, direção do surf, estados, expiração de fala, leitura do balão, movimento reduzido e interrupção na saída.
- Nove testes Playwright aprovados contra o build de produção em Chrome: ativação sob demanda, erro/retry da imagem, instância única, fala durante pausa, altura variável da taskbar, 1440×900 / 390×844 / 320×568, gestos com foco, redução de movimento em execução, percurso, pausa, resize e dez ciclos de reabertura.
- Suspensão e retomada da aba verificadas por evento de visibilidade controlado no teste; não foi uma medição em aparelho físico. Saída da home remove o personagem e permanece sem ele após avançar o relógio.
- Capturas inspecionadas em desktop e celular. Quadros de entrada, saída, repouso, surf e gestos inspecionados sobre teal, branco e preto.
- `npm run lint`, `npm run typecheck`, `npm run build` e `git diff --check` aprovados. Revisão independente aprovou as correções de pausa, leitura, limites e atualização das áreas reservadas.
- Ajuste de animação em relação à proposta: repouso usa frame neutro intercalado com gestos; não foi inventado um ciclo dedicado de piscar, que não está mapeado na fonte consultada. O personagem surfa em vez de executar uma caminhada de pernas, como previsto na pesquisa.
- Falas solicitadas continuam funcionando com o passeio pausado. A região do balão suspende sua contagem de leitura; foco/ponteiro nos controles suspendem deslocamento e ações autônomas, sem congelar gestos de conversa.
- A posição considera a altura real da taskbar e observa alterações nas janelas para atualizar os retângulos de inscrição. Os controles usam a camada 75, abaixo do menu e da taskbar.

## Entrega local

A implementação está disponível no checkout local. Não foi feito deploy. A procedência e a incerteza sobre a licença dos sprites históricos estão registradas em `public/bonzi/README.md`.
