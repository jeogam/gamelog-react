import Link from "next/link";

export default function Landing() {
  return (
    <main className="relative overflow-hidden">
      {/* Fundo: radial + aurora */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* base */}
        <div className="absolute inset-0 bg-[#0D1117]" />

        {/* radial principal */}
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#E839C2]/12 blur-[90px]" />
        <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] rounded-full bg-white/5 blur-[110px]" />

        {/* grade sutil */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <section className="app-container flex min-h-[82vh] items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-5xl">
          {/* “Card” do Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
            {/* highlight top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-12">
              {/* Coluna texto */}
              <div className="text-center lg:text-left">
                {/* Tag/Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#E839C2] shadow-[0_0_16px_rgba(232,57,194,0.65)]" />
                  Organize sua vida gamer
                </div>

                {/* Título com glow */}
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  <span className="relative">
                    Bem-vindo ao{" "}
                    <span className="relative inline-block">
                      <span className="absolute -inset-2 -z-10 rounded-2xl bg-[#E839C2]/10 blur-xl" />
                      GameLog
                    </span>
                    <span className="text-[#E839C2] drop-shadow-[0_0_18px_rgba(232,57,194,0.55)]">
                      .
                    </span>
                  </span>
                </h1>

                {/* Subtítulo mais legível */}
                <p className="mt-4 text-base font-medium leading-relaxed text-white/85 sm:text-lg">
                  Seu hub definitivo para rastrear, avaliar e descobrir jogos.
                </p>

                {/* Descrição */}
                <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  O GameLog é o companheiro ideal para todo gamer. Registre o
                  que você já zerou, descubra novas aventuras e organize sua
                  coleção em um só lugar.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/busca"
                    className="
                      group inline-flex items-center justify-center gap-2
                      rounded-xl px-6 py-3
                      bg-[#E839C2] text-white font-semibold
                      shadow-[0_8px_24px_rgba(232,57,194,0.20)]
                      transition
                      hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(232,57,194,0.28)]
                      focus:outline-none focus:ring-2 focus:ring-[#E839C2]/40
                      active:translate-y-0
                    "
                  >
                    <span className="transition group-hover:scale-105">🔍</span>
                    Explorar jogos
                    <span className="ml-1 text-white/80 transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/biblioteca"
                    className="
                      group inline-flex items-center justify-center gap-2
                      rounded-xl px-6 py-3
                      border border-white/15
                      bg-white/[0.02]
                      text-white/90 font-semibold
                      transition
                      hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-white/25
                      focus:outline-none focus:ring-2 focus:ring-white/20
                      active:translate-y-0
                    "
                  >
                    <span className="transition group-hover:scale-105">🎮</span>
                    Abrir biblioteca
                  </Link>
                </div>

                {/* Link de registro */}
                <div className="mt-6 text-sm text-white/60">
                  Ainda não tem conta?{" "}
                  <Link
                    href="/register"
                    className="
      inline-flex items-center gap-2
      font-semibold text-[#E839C2]
      hover:text-[#ff75d6]
      underline underline-offset-4
      decoration-[#E839C2]/60 hover:decoration-[#ff75d6]/80
      transition
    "
                    aria-label="Criar conta (Cadastrar)"
                    title="Criar conta"
                  >
                    Criar conta
                    <span className="text-white/70">→</span>
                  </Link>
                </div>
              </div>

              {/* Coluna “feature list” (vira stack no mobile) */}
              <div className="flex items-center">
                <div className="w-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
                  <h3 className="text-left text-sm font-semibold text-white/85">
                    O que você faz no GameLog
                  </h3>

                  <ul className="mt-4 space-y-3 text-left text-sm text-white/70 sm:text-[15px]">
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05] text-white/80">
                        ✓
                      </span>
                      <span>
                        Cria sua biblioteca e marca progresso (zerado, jogando,
                        backlog).
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05] text-white/80">
                        ✓
                      </span>
                      <span>Descobre jogos usando busca rápida e filtros.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05] text-white/80">
                        ✓
                      </span>
                      <span>
                        Organiza listas personalizadas (favoritos, quero jogar,
                        etc.).
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.05] text-white/80">
                        ✓
                      </span>
                      <span>
                        Perfil com avatar e histórico para acompanhar sua
                        jornada.
                      </span>
                    </li>
                  </ul>

                  {/* mini CTA secundário */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-[#0D1117]/50 p-4">
                    <p className="text-sm font-medium text-white/80">
                      Dica: pressione{" "}
                      <span className="rounded-md border border-white/15 bg-white/[0.04] px-2 py-0.5">
                        Enter
                      </span>{" "}
                      na busca da navbar para pesquisar rapidão.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* rodapé do card (micro detalhe) */}
            <div className="flex items-center justify-center border-t border-white/10 bg-white/[0.02] px-6 py-4 text-xs text-white/50">
              © 2025 GameLog. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
