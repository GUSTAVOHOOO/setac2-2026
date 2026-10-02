# Minicurso GJ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar o minicurso `LLMs e agentes de IA na prática` com Gustavo Mazur e Jorge Camargo no lugar do placeholder `minicurso-2`.

**Architecture:** Manter o id existente e alterar somente os dados estáticos que alimentam as páginas, cards, programação, inscrição e assistente de palestrantes. Os componentes existentes resolverão automaticamente os perfis, fotos, links externos e página do minicurso.

**Tech Stack:** Next.js 16, React 19, TypeScript, dados estáticos em TypeScript, `next/image`, ESLint, TypeScript e build estático.

---

### Task 1: Cadastrar os ministrantes e o conteúdo do minicurso

**Files:**
- Modify: `src/data/palestrantes.ts`
- Modify: `src/data/palestras.ts`

- [ ] **Step 1: Add Gustavo Mazur and Jorge Camargo to `PALESTRANTES` and `ORDEM_PALESTRANTES`**

Adicionar os dois registros antes do fechamento de `PALESTRANTES`, usando os ids `gustavo-mazur` e `jorge-camargo`, associando ambos a `minicurso-2`, com estas informações:

```ts
  'gustavo-mazur': {
    nome: 'Gustavo Mazur',
    bio: [
      'Cofundador, Head de Produto e desenvolvedor full stack na TraceFarm',
      'Estudante de Ciência da Computação na UTFPR Santa Helena',
      'Atua com agentes de IA, automação e engenharia de software',
      'Presidente do Centro Acadêmico de Ciência da Computação da UTFPR-SH; três colocações em hackathons',
      'Desenvolvedor do site da Setac² 2026',
    ],
    palestra: 'minicurso-2',
    foto: '/palestrantes/gustavo.png',
    linkedin: 'https://www.linkedin.com/in/gustavo-mazur-a55863325/?isSelfProfile=true',
  },
  'jorge-camargo': {
    nome: 'Jorge Camargo',
    bio: [
      'Desenvolvedor full stack e estudante de Ciência da Computação na UTFPR',
      'Técnico formado em Análise de Sistemas',
      'Experiência com JavaScript, TypeScript, Node.js, Flutter, Python e MySQL',
      'Focado em desenvolvimento de software, aprendizado contínuo e boas práticas',
    ],
    palestra: 'minicurso-2',
    foto: '/palestrantes/jorge.png',
    linkedin: 'https://www.linkedin.com/in/jorge-camargo-51222a272/',
  },
```

Adicionar os ids `gustavo-mazur` e `jorge-camargo` ao final de `ORDEM_PALESTRANTES` para que os dois perfis também apareçam no assistente `/palestrantes`.

- [ ] **Step 2: Replace the `minicurso-2` placeholder**

Substituir a entrada atual em `PALESTRAS` por:

```ts
  'minicurso-2': {
    tipo: 'minicurso',
    rotulo: 'Minicurso 2',
    titulo: 'LLMs e agentes de IA na prática',
    data: '2026-10-06',
    inicio: '14:30',
    fim: '16:15',
    palestrantes: ['gustavo-mazur', 'jorge-camargo'],
    chamada: 'Pare, estruture e verifique antes de confiar no agente.',
    resumo: [
      'Neste minicurso, Gustavo Mazur e Jorge Camargo apresentam como usar modelos de linguagem e agentes de IA de forma prática, entendendo escolhas de modelo, custo, contexto, ferramentas e limites.',
      'A aula conecta fundamentos de LLMs, modelos locais, agentes, harnesses, permissões e verificação a uma tarefa real de desenvolvimento. A turma acompanha o planejamento, a execução e a revisão de uma alteração em um projeto.',
      'O conteúdo é voltado a estudantes iniciantes de Ciência da Computação e prioriza decisões que ajudam a produzir resultados úteis, seguros e verificáveis.',
    ],
  },
```

- [ ] **Step 3: Run the type check**

Run: `npm run typecheck`

Expected: PASS, with the generated route types and TypeScript compilation completing without errors.

- [ ] **Step 4: Commit the content data**

```bash
git add src/data/palestrantes.ts src/data/palestras.ts
git commit -m "Adiciona minicurso de LLMs e agentes"
```

### Task 2: Atualizar programação e inscrição

**Files:**
- Modify: `src/data/programacao.ts:163-171`
- Modify: `src/data/inscricoes.ts:20-24`

- [ ] **Step 1: Update the scheduled activity**

Na entrada de `minicurso-2` em `PROGRAMACAO`, alterar `fim` para `16:15`, `desc` para `LLMs e agentes de IA na prática`, remover `aDefinir` e usar:

```ts
quem: 'Gustavo Mazur e Jorge Camargo',
```

- [ ] **Step 2: Set the registration form**

Substituir `undefined` em `INSCRICOES` por:

```ts
'minicurso-2': 'https://forms.gle/97cAe3KA1jGADMxx7',
```

Não adicionar o link `https://forms.gle/7y9e436PpjpFT7Az7`, pois a planilha identifica esse link como lista de presença, não inscrição.

- [ ] **Step 3: Run targeted content checks**

Run: `rg -n "minicurso-2|LLMs e agentes|97cAe3KA1jGADMxx7|Tema e ministrante|A DEFINIR" src/data`

Expected: the new title and registration link appear in the data; placeholder text and `aDefinir` do not appear in the `minicurso-2` entries.

- [ ] **Step 4: Commit the schedule and registration data**

```bash
git add src/data/programacao.ts src/data/inscricoes.ts
git commit -m "Atualiza horario e inscricao do minicurso GJ"
```

### Task 3: Verify generated pages and assets

**Files:**
- Verify: `public/palestrantes/gustavo.png`
- Verify: `public/palestrantes/jorge.png`
- Verify: `/minicursos/minicurso-2`, `/programacao`, `/palestrantes`

- [ ] **Step 1: Confirm the photo files exist**

Run: `Test-Path -LiteralPath 'public\\palestrantes\\gustavo.png'; Test-Path -LiteralPath 'public\\palestrantes\\jorge.png'`

Expected: both commands output `True`.

- [ ] **Step 2: Run lint and production build**

Run: `npm run lint`

Expected: ESLint completes with no errors.

Run: `npm run build`

Expected: Next.js completes the production build and generates the static minicurso route without errors.

- [ ] **Step 3: Confirm final repository state**

Run: `git status --short`

Expected: only the unrelated pre-existing worktree changes remain, with no untracked or modified files from this implementation.
