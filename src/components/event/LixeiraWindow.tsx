'use client';

import { useState } from 'react';
import { ListView } from '@/components/win98/ListView';
import { PixelIcon } from '@/components/win98/PixelIcon';
import { Window } from '@/components/win98/Window';
import { LIXEIRA } from '@/data/lixeira';

/**
 * A Lixeira: pasta do Explorer com os arquivos zoados. Cada um abre no Bloco de Notas.
 * "Esvaziar Lixeira" não funciona, e isso é uma decisão de projeto.
 */
export function LixeiraWindow({ closeHref }: { closeHref?: string }) {
  const [negado, setNegado] = useState(false);

  return (
    <Window
      title="Lixeira"
      titleId="lixeira-titulo"
      icon="/icons/lixeira.svg"
      closeHref={closeHref}
      body={false}
      statusbar={[`${LIXEIRA.length} objeto(s)`, 'Clique para abrir']}
      style={{ width: '100%', maxWidth: 820 }}
    >
      <div className="w98-actions site-lixeira-actions">
        <button type="button" className="w98-btn" onClick={() => setNegado(true)}>
          <PixelIcon src="/icons/lixeira.svg" />
          <span>
            <u>E</u>svaziar Lixeira
          </span>
        </button>
      </div>
      {negado ? (
        <div className="w98-note site-lixeira-erro" role="alert">
          <PixelIcon src="/icons/erro.svg" alt="Erro" size={32} />
          <div>
            <b>Não foi possível esvaziar a Lixeira.</b>
            <br />
            Esses arquivos fazem parte da história do curso. Ninguém mandou apagar.
          </div>
        </div>
      ) : null}
      <ListView
        caption="Arquivos na Lixeira"
        columns={[
          { label: 'Nome' },
          { label: 'Local original' },
          { label: 'Excluído em' },
          { label: 'Tipo' },
          { label: 'Tamanho' },
        ]}
        rows={LIXEIRA.map((a) => ({
          key: a.id,
          icon: a.icone,
          name: a.nome,
          href: `/lixeira/${a.id}`,
          cells: [a.localOriginal, a.excluidoEm, a.tipo, a.tamanho],
        }))}
      />
    </Window>
  );
}
