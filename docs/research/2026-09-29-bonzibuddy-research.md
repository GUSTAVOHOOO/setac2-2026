# BonziBUDDY: pesquisa para o easter egg da SETAC

Pesquisa em 29/09/2026. Escopo: referência histórica, sprites, animações, falas e uma adaptação pequena para o site. Não foram baixados nem executados instaladores históricos.

## O que era

O nome é **BonziBUDDY**: o gorila roxo animado distribuído pela Bonzi Software. A FTC descreve o produto como software gratuito que interagia com usuários e oferecia sugestões de compras, piadas e curiosidades. Em fevereiro de 2004, a empresa concordou com uma penalidade de US$ 75 mil para encerrar acusações relacionadas à coleta de dados de crianças sem consentimento parental. Isso sustenta a associação histórica com invasão de privacidade; não prova, por si só, que fosse um vírus autorreplicante. Para o site, a referência relevante é o companheiro de desktop inconveniente e carismático. [FTC, registro primário de 2004](https://www.ftc.gov/news-events/news/press-releases/2004/02/umg-recordings-inc-pay-400000-bonzi-software-inc-pay-75000-settle-coppa-civil-penalty-charges).

## Como reproduzir a linguagem de movimento

A documentação do Microsoft Agent oferece uma referência primária para esse tipo de personagem: estados de entrada, saída, ociosidade, gestos, movimento e fala; múltiplas animações podiam ser sorteadas para um mesmo estado. Há uma distinção útil: no `MoveTo`, o Agent prepara uma pose de movimento e desloca seu último quadro; não anima continuamente os quadros durante esse deslocamento. Portanto, um Bonzi deslizando/surfando pela tela é coerente com essa linguagem. Não é necessário inventar uma caminhada humana. O Agent foi descontinuado a partir do Windows 7. [Microsoft: Agent States](https://learn.microsoft.com/en-us/windows/win32/lwef/agent-states).

Esta pesquisa não confirmou a implementação interna de cada versão do programa original. A documentação acima descreve a plataforma histórica; os índices de sprites abaixo pertencem a uma recriação web e não devem ser apresentados como especificação oficial do executável BonziBUDDY.

## Sprites concretos e verificação

Foi inspecionado o repositório comunitário `TheRealKCFan20/BonziWORLD`, revisão fixa `0635b420251c07a94f8c90158ffe9e19198246ad`, ramo `1.6.1`. Ele é fonte primária sobre **a própria recriação**, não sobre a autoria original da arte. O endpoint do antigo repositório `heyjoeway/BonziWORLD` retornou 404 nesta sessão; por isso os links abaixo apontam para a cópia realmente consultada.

- [PNG roxo, revisão fixa](https://raw.githubusercontent.com/TheRealKCFan20/BonziWORLD/0635b420251c07a94f8c90158ffe9e19198246ad/src/www/img/bonzi/purple.png): cabeçalho PNG inspecionado diretamente, **3400 × 3360 pixels**, **599418 bytes**.
- [Metadados da recriação](https://github.com/TheRealKCFan20/BonziWORLD/blob/0635b420251c07a94f8c90158ffe9e19198246ad/src/www/js/bonziData.js): células de **200 × 160 pixels**; logo a grade comporta **17 colunas × 21 linhas = 357 posições**. Isso não significa 357 quadros únicos ou todos utilizados.

Subconjunto de índices, base zero, confirmado no arquivo:

| Ação                        | Quadros                    |
| --------------------------- | -------------------------- |
| Neutro                      | 0                          |
| Preparar surf / manter pose | 1–8 / 9                    |
| Palmas                      | entrada 10–12; ciclo 13–15 |
| Sair surfando               | 16–38; invisível 39        |
| Dar de ombros               | 40–50; manter 50           |
| Apresentar                  | 137–141; manter 142        |
| Chegar surfando             | 277–302                    |
| Mortal para trás            | 331–343                    |

Várias saídas reproduzem a entrada ao contrário. Para recortar uma célula: `x = (índice % 17) * 200`, `y = floor(índice / 17) * 160`. Validar visualmente os quadros selecionados antes de integrar; o mapa não prova duração, transparência e aparência de cada célula isoladamente.

O [controlador da recriação](https://github.com/TheRealKCFan20/BonziWORLD/blob/0635b420251c07a94f8c90158ffe9e19198246ad/src/www/js/bonziHandler.js) usa atualização a 15 quadros por segundo. É um ponto de partida para o easter egg, sem afirmar que reproduz a temporização original.

### Proveniência e licença

O [LICENSE da revisão consultada](https://github.com/TheRealKCFan20/BonziWORLD/blob/0635b420251c07a94f8c90158ffe9e19198246ad/LICENSE) declara MIT para o software. Não foi encontrada comprovação de que o mantenedor detenha os direitos sobre a arte histórica do personagem ou possa relicenciá-la. Guardar URL, revisão, créditos e essa incerteza junto ao asset; não rotular os sprites como domínio público. Um segundo fork consultado apresenta divergência entre README (MIT) e LICENSE (Apache 2.0), reforçando a necessidade de registrar a origem exata em vez de presumir equivalência entre forks. [Segundo fork](https://github.com/BonziWorld543/BonziWORLD).

## Voz e falas

O Microsoft Agent suporta saída sintetizada por SAPI e recebe texto através de `Speak`; a documentação também prevê balão de texto. Ela não identifica qual voz específica cada versão do Bonzi usava. [Microsoft: Synthesized Speech Support](https://learn.microsoft.com/en-us/windows/win32/lwef/synthesized-speech-support).

O [código da recriação](https://github.com/TheRealKCFan20/BonziWORLD/blob/0635b420251c07a94f8c90158ffe9e19198246ad/src/www/js/bonzi.es2015) chama `speak.play`, usa velocidade 175 e pitch 50. Esses parâmetros são daquela biblioteca e não podem ser copiados numericamente para a Web Speech API. As piadas no fork são conteúdo comunitário alterado: não há evidência de que sejam transcrições fiéis do Bonzi original.

**Decisão confirmada pelo usuário: balões em português, com piadas de computação, sem som.** A pesquisa sobre voz serve apenas como contexto histórico; não incluir áudio, síntese de fala ou controles de volume nesta versão.

Falas **novas**, sugeridas para a SETAC, sem atribuição ao programa original:

- “Oi! Sou o Bonzi. Vim dar um rolê na SETAC.”
- “Você veio pela ciência. Eu vim pelo café.”
- “Meu código compila. Minha vida ainda está em beta.”
- “Prometo não apresentar um trabalho de 80 slides.”
- “Já deu uma olhada na programação?”
- “Vou ali reiniciar minha carreira. Até já!”

## Plano de adaptação proposto

As escolhas seguintes são recomendações de produto, não fatos históricos:

1. Ícone/aplicativo `BonziBUDDY.exe` na Hero: clicar cria uma única instância sobre a página.
2. Entrada surfando, saudação em balão e intervalos tranquilos alternando neutro, gesto e deslocamento. Usar uma pose de surf ao transladar; manter dentro da viewport e longe da barra de tarefas.
3. Clique no personagem alterna uma fala curta em português, sem som. Manter pausa e despedida acessíveis; não incluir arrastar nesta versão, conforme a proposta de implementação.
4. Usar assets locais com revisão e origem registradas. Carregar sprite apenas quando ativado. Não importar o cliente inteiro do BonziWORLD ou sua infraestrutura de chat.
5. Respeitar redução de movimento; nesse modo mostrar a pose neutra e falas acionadas pelo usuário, sem passeio ou gestos automáticos. Em telas pequenas, ajustar escala, balão e limites.
6. Testar abrir duas vezes, fechar durante balão/movimento, reabrir, resize, teclado, erro no carregamento do sprite e leitura/cliques do conteúdo atrás do personagem.

Uma implementação pequena precisa de entrada, idle, surf, gesto e saída. Mortal e outras performances podem ser adicionados sem comprometer essa base. Não há necessidade de IA, microfone, backend ou de executar qualquer componente do programa antigo. A proposta completa, com escolhas de interação e critérios de aceite, está em [2026-09-29-bonzibuddy.md](../superpowers/plans/2026-09-29-bonzibuddy.md).
