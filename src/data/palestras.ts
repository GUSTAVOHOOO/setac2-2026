import type { Palestra, PalestraId } from './types';

/**
 * Palestras e minicursos por id. Os mesmos ids aparecem em `programacao.ts` (campo `palestra`)
 * e em `palestrantes.ts` (campo `palestra`). Minicursos usam `tipo: 'minicurso'`.
 * Sem `local` → "A confirmar". Sem `resumo` → "Resumo em breve".
 *
 * Links de inscrição (Google Forms) ficam em `inscricoes.ts`.
 */
export const PALESTRAS: Record<PalestraId, Palestra> = {
  'direito-digital': {
    rotulo: 'Palestra de abertura',
    titulo: 'Direito Digital, Crimes Cibernéticos e Responsabilidade Legal na Computação',
    data: '2026-10-05',
    inicio: '09:30',
    fim: '11:00',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['leticia-remonti'],
    resumo: [
      'Aquele print salva você num processo? Depende. A jurista Leticia Remonti fala sobre o que acontece quando a internet vira caso de justiça.',
      'Fake news e desinformação: impacto social e responsabilidade de desenvolvedores e plataformas. Calúnia, difamação e injúria na web: distinções legais e provas digitais (print screen, ata notarial ou blockchain). E casos práticos envolvendo redes sociais e fóruns.',
    ],
  },
  'cyber-veiculos': {
    rotulo: 'Palestra de abertura',
    titulo:
      'Expert em cybersecurity: experiências trabalhando com detecção de ataques em veículos autônomos',
    data: '2026-10-05',
    inicio: '11:00',
    fim: '12:30',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['isadora-ferrao'],
    resumo: [
      'Isadora Ferrão, pós-doutoranda no Lab-STICC da Université de Bretagne Occidentale (França), conta como é pesquisar cybersecurity em veículos autônomos: como ataques a esses sistemas são detectados, o que aprendeu no doutorado entre Brasil, França, Inglaterra e República Tcheca, e como é trabalhar com safety e security em veículos aéreos autônomos.',
    ],
  },
  erasmus: {
    rotulo: 'Palestra 2',
    titulo:
      'Dupla Diplomação na Universidade Politécnica de Bragança (UPB) e oportunidades internacionais pelo programa Erasmus+',
    data: '2026-10-06',
    inicio: '09:15',
    fim: '12:00',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['daniel-costa', 'adrieli-ritt'],
    chamada: 'Mais do que um relato de experiência,',
    resumo: [
      'a palestra pretende orientar interessados em DD (Dupla Diplomação) com dicas importantes sobre a vida universitária e pessoal em Bragança e a vivência na cidade. Mostram-se com imagens o ambiente, a estrutura, recursos técnico-científicos e um pouco da cultura da instituição e da cidade de Bragança e seus arredores.',
      'Ainda, fala-se sobre como funciona o programa Erasmus+, que é uma oportunidade para estudantes internacionais viajarem pelos países da União Europeia, conhecerem novas culturas e envolverem-se em ações internacionais, com despesas reembolsáveis. Cumpridas as obrigações da dupla diplomação, os estudantes podem participar do Erasmus+, como fizeram os palestrantes.',
    ],
  },
  mercado: {
    rotulo: 'Palestra 3',
    titulo: 'Conecte-se ao Mercado: LinkedIn, Currículo e Oportunidades',
    data: '2026-10-06',
    inicio: '13:30',
    fim: '14:30',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['gustavo-quieregato'],
    resumo: [
      'Gustavo atua como Desenvolvedor Especialista no ecossistema UOL e já passou por diferentes empresas e áreas da tecnologia, do desenvolvimento web à inteligência artificial.',
      'Aluno do programa de Dupla Diplomação, ele compartilha sua experiência e dá dicas práticas para melhorar o currículo, fortalecer o perfil profissional e construir conexões mais relevantes no LinkedIn, ampliando suas oportunidades no mercado de tecnologia.',
    ],
  },
  aws: {
    tipo: 'minicurso',
    rotulo: 'Minicurso 1',
    titulo: 'Preparatório AWS Cloud Practitioner (CLF-C02)',
    data: '2026-10-05',
    inicio: '13:30',
    fim: '16:00',
    palestrantes: ['gabriel-scheffler', 'welington-ferreira'],
    chamada:
      'Quer começar na computação em nuvem e sair com um caminho claro para a primeira certificação AWS?',
    resumo: [
      'Neste minicurso de 2h30, Gabriel e Wellington apresentam tudo o que cai na prova AWS Certified Cloud Practitioner, seguindo os quatro domínios do exame: conceitos de cloud computing; segurança e controle de acesso (IAM, modelo de responsabilidade compartilhada); infraestrutura global e principais serviços (EC2, S3, Lambda, RDS, DynamoDB); e preços, cobrança e planos de suporte.',
      'O Gabriel, que já é certificado, também conta como foi a preparação dele, quais materiais usou e como eliminar as alternativas erradas nas questões de cenário. No final, a turma resolve algumas questões no estilo oficial.',
      'Voltado a estudantes de TI. Não precisa ter experiência prévia com AWS.',
    ],
  },
  'minicurso-2': {
    tipo: 'minicurso',
    rotulo: 'Minicurso 2',
    titulo: 'Tema a definir',
    aDefinir: true,
    data: '2026-10-06',
    inicio: '14:30',
    fim: '16:00',
    palestrantes: [],
    resumo: [],
  },
};
