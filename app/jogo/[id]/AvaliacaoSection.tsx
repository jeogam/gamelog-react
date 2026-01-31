"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { perfilService } from "@/services/perfilService";
import {
  listarAvaliacoesDoJogo,
  AvaliacaoResponseDTO,
} from "@/services/avaliacaoService";
import AvaliacaoForm from "@/components/AvaliacaoForm";

type Props = {
  jogoId: string;
};

// Pequeno ajuste para aceitar números quebrados se quiser (opcional), 
// mas mantendo simples com arredondamento para exibição das estrelas.
function StarsView({ value, className }: { value: number, className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i + 1 <= Math.round(value); // Arredonda para preencher a estrela
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

function Avatar({
  src,
  alt,
  size = 36,
}: {
  src?: string;
  alt: string;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  const s = `${size}px`;

  if (!src || broken) {
    return (
      <div
        style={{ width: s, height: s }}
        className="grid place-items-center rounded-full border border-white/10 bg-zinc-900 text-xs font-bold text-zinc-200"
        aria-label={alt}
        title={alt}
      >
        {alt?.trim()?.slice(0, 1)?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: s, height: s }}
      className="rounded-full border border-white/10 object-cover"
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

export default function AvaliacaoSection({ jogoId }: Props) {
  const [usuarioId, setUsuarioId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponseDTO[]>([]);

  // 1. Calcula a média baseada nas avaliações carregadas
  const media = avaliacoes.length
    ? avaliacoes.reduce((acc, curr) => acc + curr.nota, 0) / avaliacoes.length
    : 0;

  async function loadUsuario() {
    try {
      const perfil = await perfilService.getMeuPerfil();
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
      <AvaliacaoForm jogoId={jogoId} usuarioId={usuarioId} onSuccess={loadAvaliacoes} />

      {/* LISTAGEM */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
        
        {/* CABEÇALHO DA LISTA (Com a Média) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-semibold text-zinc-100">
              Avaliações da comunidade
            </h3>

            {/* 2. Exibe a média se houver avaliações */}
            {!loading && avaliacoes.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1">
                <span className="text-sm font-bold text-yellow-500">
                  {media.toFixed(1)}
                </span>
                <StarsView value={media} />
              </div>
            )}
          </div>

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
            {avaliacoes.map((av) => {
              const nome = av.nomeExibicao?.trim() || "Usuário";
              const data = av.createdAt
                ? new Date(av.createdAt).toLocaleDateString("pt-BR")
                : null;

              return (
                <div
                  key={av.id}
                  className="rounded-xl border border-white/10 bg-zinc-950/30 p-4"
                >
                  {/* topo: autor + data */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <Link
                      href={`/perfil/${av.usuarioId}`}
                      className="group flex items-center gap-3"
                    >
                      <Avatar src={av.avatarImagem} alt={nome} size={36} />
                      <div className="leading-tight">
                        <div className="text-sm font-semibold text-zinc-100 group-hover:underline">
                          {nome}
                        </div>
                        <div className="text-xs text-zinc-500">Ver perfil</div>
                      </div>
                    </Link>

                    {data ? (
                      <div className="text-right text-xs text-zinc-500">{data}</div>
                    ) : null}
                  </div>

                  {/* conteúdo */}
                  <div className="space-y-2">
                    <StarsView value={av.nota} />
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                      {av.comentario || "Sem comentário."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}