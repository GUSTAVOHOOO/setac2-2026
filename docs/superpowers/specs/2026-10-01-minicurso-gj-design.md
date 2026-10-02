# Design: Minicurso GJ no site da SETAC

## Objetivo

Substituir o placeholder `minicurso-2` pelo minicurso apresentado por Gustavo Mazur e Jorge Camargo, mantendo a rota, os componentes e o sistema visual já existentes no site.

## Escopo

- Atualizar o minicurso com o título `LLMs e agentes de IA na prática`.
- Manter o minicurso no dia 06/10/2026 e ajustar o horário para 14:30–16:15.
- Usar o formulário de inscrição da planilha: `https://forms.gle/97cAe3KA1jGADMxx7`.
- Cadastrar Gustavo Mazur e Jorge Camargo como ministrantes, com bios resumidas, LinkedIns e fotos locais.
- Usar `public/palestrantes/gustavo.png` e `public/palestrantes/jorge.png`.
- Atualizar a programação para refletir o novo título, horário e nomes.
- Não alterar componentes visuais, rotas ou o link separado da lista de presença.

## Dados dos ministrantes

Gustavo Mazur será descrito como cofundador, Head de Produto e desenvolvedor full stack da TraceFarm, estudante da UTFPR, com atuação em agentes de IA, automação e engenharia de software. A bio também registra os três resultados em hackathons, a presidência do Centro Acadêmico de Ciência da Computação da UTFPR-SH e a autoria do site da SETAC².

Jorge Camargo será descrito como desenvolvedor full stack e estudante de Ciência da Computação na UTFPR e de Análise e Desenvolvimento de Sistemas. A bio destaca JavaScript, TypeScript, Node.js, Flutter, Python, MySQL, desenvolvimento de software e aprendizado contínuo.

## Arquitetura e fluxo

O id `minicurso-2` continua em `PALESTRA_IDS`, porque ele já é usado pela programação, pela página estática e pelo resolvedor de atividades. A entrada correspondente em `PALESTRAS` passa a ser o minicurso real e deixa de usar `aDefinir`.

`PALESTRANTES` receberá dois ids novos, associados ao `minicurso-2`. O `TalkCard` existente resolverá automaticamente os nomes, bios, fotos e links do LinkedIn. `INSCRICOES` receberá o link de inscrição da planilha; o link da lista de presença não será usado pelo site.

## Verificação

- Confirmar que o título, horário, nomes e resumo aparecem na página do minicurso e na programação.
- Confirmar que os dois perfis aparecem na página de palestrantes com fotos e links externos.
- Confirmar que o botão de inscrição aponta para o formulário correto.
- Rodar `npm run typecheck`, `npm run lint` e `npm run build`.
- Verificar que nenhuma ocorrência funcional do placeholder `Tema a definir` ou `A DEFINIR` permanece para o `minicurso-2`.
