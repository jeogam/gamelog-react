"use client";

import { useEffect, useState } from "react";
import { perfilService } from "@/services/perfilService";
import { listarAvaliacoesDoJogo, AvaliacaoResponseDTO } from "@/services/avaliacaoService";
import AvaliacaoForm from "@/components/AvaliacaoForm";
import { Star } from "lucide-react";

type Props = {
  jogoId: string;
};

function StarsView({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i + 1 <= value;
        return (
          <Star
            key={i}
            className={filled ? "h-4 w-4 text-yellow-400" : "h-4 w-4 text-zinc-600"}
            fill={filled ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}

export default function AvaliacaoSection({ jogoId }: Props) {
  const [usuarioId, setUsuarioId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponseDTO[]>([]);

  async function loadUsuario() {
    try {
      const perfil = await perfilService.getMeuPerfil();
      // ✅ precisa ser UUID do usuário
      const uid = (perfil as any)?.usuarioId;
      if (uid) setUsuarioId(String(uid));
    } catch {
      setUsuarioId(undefined);
    }
  }

  async function loadAvaliacoes() {
    if (!jogoId) return;
    setErro(null);
    setLoading(true);
    try {
      const lista = await listarAvaliacoesDoJogo(jogoId);
      setAvaliacoes(lista);
    } catch (e: any) {
      setErro(e?.response?.data?.message || "Não foi possível carregar as avaliações.");
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuario();
  }, []);

  useEffect(() => {
    loadAvaliacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jogoId]);

  return (
    <section className="space-y-4">
      {/* FORM */}
      <AvaliacaoForm
        jogoId={jogoId}
        usuarioId={usuarioId}
        onSuccess={() => loadAvaliacoes()}
      />

      {/* LISTAGEM */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-zinc-100">
            Avaliações de outros usuários
          </h3>
          <span className="text-sm text-zinc-400">
            {avaliacoes.length} {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
          </span>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-zinc-400">Carregando avaliações...</p>
        ) : erro ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {erro}
          </p>
        ) : avaliacoes.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">
            Ainda não há avaliações para este jogo. Seja o primeiro!
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {avaliacoes.map((av) => (
              <div
                key={av.id}
                className="rounded-xl border border-white/10 bg-zinc-950/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <StarsView value={av.nota} />
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                      {av.comentario || "Sem comentário."}
                    </p>
                  </div>

                  <div className="text-right text-xs text-zinc-500">
                    <div className="truncate max-w-[140px]">
                      {av.usuarioId?.slice(0, 8)}…
                    </div>
                    {av.createdAt ? (
                      <div>{new Date(av.createdAt).toLocaleDateString("pt-BR")}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
