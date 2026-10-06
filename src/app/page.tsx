import { Hero } from '@/components/event/Hero';
import { BonziLauncher } from '@/components/bonzi/BonziLauncher';
import { InscricaoWindow } from '@/components/event/InscricaoWindow';
import { PizzaWindow } from '@/components/event/PizzaWindow';
import { Marquee } from '@/components/web90s/Marquee';
import { ButtonLink } from '@/components/win98/Button';
import { DesktopIcon, IconGrid } from '@/components/win98/DesktopIcon';
import { Window } from '@/components/win98/Window';
import { NAV, SITE } from '@/lib/site';

export default function Home() {
  return (
    <div className="site-home">
      <Marquee>
        *** INSCRIÇÕES POR ATIVIDADE *** SETAC² 2026 *** 05 E 06/10 *** UTFPR SANTA HELENA *** PIZZA
        NO CORUJÃO COM O IMPÉRIO DA PIZZA: R$ 10 POR PESSOA *** TRAGA SEU DISQUETE ***
      </Marquee>

      <div className="site-desktop">
        <IconGrid label="Área de trabalho">
          {NAV.filter((n) => n.href !== '/').map((n) => (
            <DesktopIcon
              key={n.href}
              href={n.href}
              icon={n.icone}
              label={n.arquivo}
              external={n.externo}
            />
          ))}
          {/* Todo desktop que se preze tem uma. */}
          <DesktopIcon href="/#pizza" icon="/icons/pizza.svg" label="Pizza.exe" />
          <DesktopIcon href="/lixeira" icon="/icons/lixeira.svg" label="Lixeira" />
          <BonziLauncher />
        </IconGrid>

        <div className="site-windows">
          <Hero />

          {/* Atalhos fora do prompt (a hero é só o CMD). */}
          <nav className="site-hero-ctas" aria-label="Atalhos">
            <ButtonLink href="/#inscricao" big isDefault icon="/icons/documento.svg">
              Fazer inscrição &gt;
            </ButtonLink>
            <ButtonLink href="/programacao" big icon="/icons/calendario.svg">
              Programação
            </ButtonLink>
            <ButtonLink href="/palestrantes" big icon="/icons/equipe.svg">
              Palestrantes
            </ButtonLink>
          </nav>

          {/* No PC abre sozinha como pop-up; no celular fica logo abaixo dos atalhos. */}
          <PizzaWindow id="pizza" inactive className="os-hide" />

          <Window
            inactive
            className="site-readme"
            title="Leia-me.txt"
            titleId="leiame-titulo"
            icon="/icons/documento.svg"
            doc
            statusbar={['Pronto', '2 dia(s)', SITE.local]}
          >
            <p style={{ margin: '0 0 8px' }}>
              <b>Setac² 2026</b>, a XIII Semana Tecnológica Acadêmica de Ciência da Computação.
            </p>
            <p style={{ margin: '0 0 8px' }}>
              Dois dias (05 e 06/10) de palestras, minicursos, competição de programação e corujão
              de jogos na UTFPR Santa Helena.
            </p>
            <p style={{ margin: 0 }}>
              <span className="site-only-wide">
                Abra os ícones do lado, ou use o menu Iniciar lá embaixo.
              </span>
              <span className="site-only-narrow">
                Toque em Iniciar, lá embaixo, para abrir tudo.
              </span>{' '}
              Ou clique em qualquer coisa, a gente não julga.
            </p>
          </Window>

          {/* No PC a janela abre como pop-up pelo ícone; aqui fica para o celular e para /#inscricao. */}
          <InscricaoWindow id="inscricao" inactive className="os-hide" />
        </div>
      </div>
    </div>
  );
}
