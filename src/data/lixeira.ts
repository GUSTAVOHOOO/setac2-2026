/**
 * O que tem na Lixeira do desktop. Só piada: cada arquivo abre no Bloco de Notas.
 * Para adicionar um, é só incluir uma entrada aqui (o id vira /lixeira/<id>).
 */

export interface ArquivoLixeira {
  id: string;
  nome: string;
  /** Coluna "Tipo" do Explorer. */
  tipo: string;
  tamanho: string;
  localOriginal: string;
  excluidoEm: string;
  icone: string;
  /** Texto que aparece no Bloco de Notas (uma linha por item; '' = linha em branco). */
  conteudo: string[];
}

export const LIXEIRA: ArquivoLixeira[] = [
  {
    id: 'tcc-final',
    nome: 'TCC_final_FINAL_agora_vai_v7.docx',
    tipo: 'Documento do Word',
    tamanho: '12 KB',
    localOriginal: 'C:\\Meus documentos\\TCC',
    excluidoEm: '04/10/2026 23:59',
    icone: '/icons/documento.svg',
    conteudo: [
      'Capítulo 1: Introdução',
      '',
      '(escrever aqui)',
      '',
      'TODO: descobrir sobre o que é o TCC.',
      'TODO: perguntar pro orientador se ele lembra de mim.',
      '',
      'Obs.: a v8 está no pendrive que ficou no laboratório.',
    ],
  },
  {
    id: 'nao-mexe',
    nome: 'codigo_que_funciona_NAO_MEXE.js',
    tipo: 'Arquivo JavaScript',
    tamanho: '1 KB',
    localOriginal: 'C:\\Projetos\\trabalho-de-ED',
    excluidoEm: '03/10/2026 02:47',
    icone: '/icons/computador.svg',
    conteudo: [
      '// Não sei por que funciona.',
      '// Parou de funcionar quando apaguei este comentário.',
      '// Não apague este comentário.',
      '',
      'function main() {',
      '  return true; // confia',
      '}',
    ],
  },
  {
    id: 'senha-do-wifi',
    nome: 'senha_do_wifi.txt',
    tipo: 'Documento de texto',
    tamanho: '1 KB',
    localOriginal: 'C:\\Área de trabalho',
    excluidoEm: '01/10/2026 08:02',
    icone: '/icons/documento.svg',
    conteudo: [
      'Rede: UTFPR-Visitantes',
      'Senha: ninguém sabe',
      '',
      'Dica: pergunte no grupo da turma. Alguém vai mandar uma foto torta',
      'do papel colado na parede, com o reflexo da lâmpada em cima da senha.',
    ],
  },
  {
    id: 'node-modules',
    nome: 'node_modules.zip',
    tipo: 'Pasta compactada',
    tamanho: '4,2 GB',
    localOriginal: 'C:\\Projetos\\app-da-turma',
    excluidoEm: '02/10/2026 14:10',
    icone: '/icons/disquete.svg',
    conteudo: [
      'Arquivo grande demais para abrir.',
      '',
      'Ele pesa mais que:',
      '- o seu HD',
      '- a sua mochila',
      '- a sua vontade de estudar Cálculo 2 numa sexta às 18h',
    ],
  },
  {
    id: 'deploy-sexta',
    nome: 'deploy_sexta_18h.bat',
    tipo: 'Arquivo em lotes',
    tamanho: '1 KB',
    localOriginal: 'C:\\Projetos\\app-da-turma',
    excluidoEm: '02/10/2026 18:01',
    icone: '/icons/computador.svg',
    conteudo: [
      '@echo off',
      'echo Subindo pra produção...',
      'echo Tudo certo, pode ir pra casa.',
      'rem (não estava tudo certo)',
    ],
  },
  {
    id: 'lista-calculo',
    nome: 'lista_calculo_2_RESOLVIDA.pdf',
    tipo: 'Documento PDF',
    tamanho: '0 KB',
    localOriginal: 'C:\\Downloads',
    excluidoEm: '30/09/2026 22:15',
    icone: '/icons/documento.svg',
    conteudo: ['Arquivo vazio.', '', 'A gente também achou que alguém tinha resolvido.'],
  },
  {
    id: 'curriculo',
    nome: 'curriculo_HTML_linguagem_de_programacao.doc',
    tipo: 'Documento do Word',
    tamanho: '8 KB',
    localOriginal: 'C:\\Meus documentos\\Estágio',
    excluidoEm: '29/09/2026 10:30',
    icone: '/icons/documento.svg',
    conteudo: [
      'Habilidades:',
      '- HTML (linguagem de programação)',
      '- Pacote Office avançado (sei abrir o Word)',
      '- Inglês: leio documentação com o tradutor',
      '- Trabalho bem sob pressão (entrego tudo às 23h59)',
    ],
  },
  {
    id: 'git-log',
    nome: 'git_log_da_madrugada.log',
    tipo: 'Arquivo de log',
    tamanho: '2 KB',
    localOriginal: 'C:\\Projetos\\trabalho-de-ED',
    excluidoEm: '04/10/2026 04:20',
    icone: '/icons/computador.svg',
    conteudo: [
      'commit 3f2a9c1  arrumei',
      'commit 8b71e0d  agora sim',
      'commit c90d44a  agora sim de verdade',
      'commit 1e0f77b  asdf',
      'commit 0000000  desculpa professor',
    ],
  },
];

export function getArquivoLixeira(id: string): ArquivoLixeira | undefined {
  return LIXEIRA.find((a) => a.id === id);
}
