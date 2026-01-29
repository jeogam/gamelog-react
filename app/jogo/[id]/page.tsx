"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ExternalLink, LibraryBig, Loader2, Star } from "lucide-react";

import { fetchGameDetails } from "@/services/gameService";
import { authService } from "@/services/authService";
import { perfilService } from "@/services/perfilService";
import { bibliotecaService, StatusJogo } from "@/services/bibliotecaService";

import AvaliacaoSection from "./AvaliacaoSection";

const STATUS_OPTIONS: { value: StatusJogo; label: string }[] = [
  { value: "QUERO_JOGAR", label: "Quero jogar" },
  { value: "JOGANDO", label: "Jogando" },
  { value: "FINALIZADO", label: "Finalizado" }, // ✅ backend
  { value: "DESISTIDO", label: "Desistido" },
];

export default function JogoDetalhes() {
  const { id } = useParams<{ id: string }>();

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [bibLoading, setBibLoading] = useState(false);
  const [bibliotecaItem, setBibliotecaItem] = useState<any | null>(null);
  const [status, setStatus] = useState<StatusJogo>("QUERO_JOGAR");
  const [favorito, setFavorito] = useState<boolean>(false);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!authService.isAuthenticated()) return;
      try {
        const perfil = await perfilService.getMeuPerfil();
        setUsuarioId(String((perfil as any).usuarioId));
      } catch {
        setUsuarioId(null);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function loadGame() {
      setErr(null);
      setMsg(null);
      setLoading(true);

      try {
        const dados = await fetchGameDetails(id as string);
        setGame(dados);
      } catch {
        setErr("Não foi possível carregar o jogo.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadGame();
  }, [id]);

  useEffect(() => {
    async function loadBiblioteca() {
      if (!usuarioId || !game?.id) return;
      setBibLoading(true);
      setErr(null);

      try {
        const item = await bibliotecaService.getItemDoUsuarioPorJogo(
          usuarioId,
          String(game.id),
        );

        if (item) {
          setBibliotecaItem(item);
          setStatus(item.status);
          setFavorito(Boolean(item.favorito));
        } else {
          setBibliotecaItem(null);
          setStatus("QUERO_JOGAR");
          setFavorito(false);
        }
      } catch {
        // não quebra UI
      } finally {
        setBibLoading(false);
      }
    }

    loadBiblioteca();
  }, [usuarioId, game?.id]);

  const googleTranslateUrl = useMemo(() => {
    const texto = (game?.descricao || "").replace(/<[^>]*>?/gm, "");
    return `https://translate.google.com/?sl=en&tl=pt&text=${encodeURIComponent(
      texto,
    )}&op=translate`;
  }, [game]);

  async function handleAddBiblioteca() {
    setErr(null);
    setMsg(null);

    if (!usuarioId) {
      setErr("Você precisa estar logado para adicionar na biblioteca.");
      return;
    }
    if (!game?.id) {
      setErr("Jogo inválido.");
      return;
    }

    setBibLoading(true);
    try {
      const created = await bibliotecaService.adicionarJogo({
        usuarioId,
        jogoId: String(game.id),
        status: "QUERO_JOGAR",
        favorito: false,
      });

      setBibliotecaItem(created);
      setStatus(created.status);
      setFavorito(Boolean(created.favorito));
      setMsg("Adicionado à biblioteca!");
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          "Não foi possível adicionar na biblioteca.",
      );
    } finally {
      setBibLoading(false);
    }
  }

  async function handleChangeStatus(next: StatusJogo) {
    setErr(null);
    setMsg(null);
    setStatus(next);

    if (!bibliotecaItem?.id) return;

    setBibLoading(true);
    try {
      // ✅ usa o state favorito (não bibliotecaItem.favorito)
      const updated = await bibliotecaService.atualizarStatus(
        String(bibliotecaItem.id),
        next,
        favorito,
      );

      setBibliotecaItem(updated);
      setStatus(updated.status);
      setFavorito(Boolean(updated.favorito));
      setMsg("Status atualizado!");
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || "Não foi possível atualizar o status.",
      );
    } finally {
      setBibLoading(false);
    }
  }

  async function handleToggleFavorito() {
    setErr(null);
    setMsg(null);

    if (!bibliotecaItem?.id) return;

    const next = !favorito;
    setFavorito(next);

    setBibLoading(true);
    try {
      // ✅ atualiza item completo (status + favorito)
      const updated = await bibliotecaService.atualizarItem(
        String(bibliotecaItem.id),
        {
          status,
          favorito: next,
        },
      );

      setBibliotecaItem(updated);
      setStatus(updated.status);
      setFavorito(Boolean(updated.favorito));
      setMsg(updated.favorito ? "Adicionado aos favoritos!" : "Removido dos favoritos.");
    } catch (e: any) {
      setFavorito(!next); // rollback
      setErr(
        e?.response?.data?.message || "Não foi possível atualizar favorito.",
      );
    } finally {
      setBibLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-zinc-200">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-zinc-200">
        Jogo não encontrado.
      </div>
    );
  }

  const descricaoLimpa = (game.descricao || "").replace(/<[^>]*>?/gm, "");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 text-zinc-100">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50">
        {game.capaUrl ? (
          <Image
            src={game.capaUrl}
            alt={game.titulo}
            fill
            className="object-cover opacity-25 blur-[2px]"
            priority
          />
        ) : null}

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
            <div className="relative h-[280px] w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/30 shadow">
              {game.capaUrl ? (
                <Image
                  src={game.capaUrl}
                  alt={`Capa de ${game.titulo}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                  Sem capa
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {game.titulo}
              </h1>

              <p className="mt-2 text-sm text-zinc-300">
                {game.genero || "Gênero não informado"}
                <span className="px-2 text-zinc-500">•</span>
                {game.anoLancamento || "Ano desconhecido"}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                {!usuarioId ? (
                  <div className="rounded-xl border border-white/10 bg-zinc-950/30 px-4 py-3 text-sm text-zinc-300">
                    Faça login para gerenciar sua biblioteca.
                  </div>
                ) : bibliotecaItem ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/30 px-4 py-3">
                      <LibraryBig className="h-5 w-5 text-indigo-300" />
                      <span className="text-sm text-zinc-200">
                        Na sua biblioteca
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-zinc-300">Status:</label>
                      <select
                        value={status}
                        disabled={bibLoading}
                        onChange={(e) =>
                          handleChangeStatus(e.target.value as StatusJogo)
                        }
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleToggleFavorito}
                        disabled={bibLoading}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 transition hover:bg-zinc-950/60 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={
                          favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
                        }
                        title={
                          favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
                        }
                      >
                        <Star
                          className={`h-4 w-4 ${
                            favorito
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-200"
                          }`}
                        />
                      </button>

                      {bibLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddBiblioteca}
                    disabled={bibLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-400"
                  >
                    {bibLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <LibraryBig className="h-5 w-5" />
                        Adicionar à biblioteca
                      </>
                    )}
                  </button>
                )}
              </div>

              {err ? (
                <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {err}
                </p>
              ) : null}
              {msg ? (
                <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {msg}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
          <h2 className="text-lg font-semibold">Sinopse</h2>

          <div className="mt-3 whitespace-pre-wrap rounded-xl border border-white/10 bg-zinc-950/30 p-4 text-sm text-zinc-200">
            {descricaoLimpa || "Sem descrição disponível."}
          </div>

          <a
            href={googleTranslateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/20 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-950/40"
          >
            <ExternalLink className="h-4 w-4" />
            Traduzir sinopse (Google Tradutor)
          </a>
        </section>

        <aside className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
          <h3 className="text-base font-semibold">Informações</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-zinc-400">Plataformas</dt>
              <dd className="text-zinc-200">
                {game.plataformas || "Não informado"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Lançamento</dt>
              <dd className="text-zinc-200">{game.anoLancamento || "—"}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="mt-8">
        <AvaliacaoSection jogoId={String(game.id)} />
      </div>
    </div>
  );
}
