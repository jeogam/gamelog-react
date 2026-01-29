"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { criarAvaliacao } from "@/services/avaliacaoService";

type AvaliacaoFormProps = {
  jogoId: string;
  usuarioId?: string;
  className?: string;
  onSuccess?: () => void;
};

export default function AvaliacaoForm({
  jogoId,
  usuarioId,
  className,
  onSuccess,
}: AvaliacaoFormProps) {
  const isAutenticado = Boolean(usuarioId);

  const [nota, setNota] = useState<number>(0);
  const [hoverNota, setHoverNota] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const notaVisivel = hoverNota || nota;
  const charsRestantes = useMemo(() => 500 - comentario.length, [comentario]);

  const desabilitado =
    !isAutenticado || loading || nota < 1 || comentario.trim().length < 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!isAutenticado) {
      setErro("Você precisa estar autenticado para avaliar.");
      return;
    }
    if (nota < 1) {
      setErro("Selecione uma nota de 1 a 5.");
      return;
    }
    const comentarioLimpo = comentario.trim();
    if (!comentarioLimpo) {
      setErro("Escreva um comentário (pode ser curto).");
      return;
    }
    if (comentarioLimpo.length > 500) {
      setErro("O comentário deve ter no máximo 500 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await criarAvaliacao({
        nota,
        comentario: comentarioLimpo,
        usuarioId: usuarioId!, // já validamos acima
        jogoId,
      });

      setSucesso("Avaliação enviada com sucesso!");
      setNota(0);
      setHoverNota(0);
      setComentario("");
      onSuccess?.();
    } catch (err: any) {
      console.log("STATUS:", err?.response?.status);
      console.log("DATA:", err?.response?.data);
      console.log("PAYLOAD:", {
        nota,
        comentario: comentarioLimpo,
        usuarioId,
        jogoId,
      });

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Não foi possível enviar sua avaliação. Tente novamente.";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={[
        "w-full rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-sm",
        className || "",
      ].join(" ")}
    >
      <header className="mb-4">
        <h3 className="text-base font-semibold text-zinc-100">
          Deixe sua avaliação
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {isAutenticado
            ? "Dê uma nota e conte o que achou."
            : "Faça login para avaliar este jogo."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stars */}
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex items-center gap-1",
              !isAutenticado ? "opacity-60" : "",
            ].join(" ")}
            aria-label="Selecione uma nota de 1 a 5"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const value = i + 1;
              const ativo = value <= notaVisivel;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={!isAutenticado || loading}
                  onMouseEnter={() => isAutenticado && setHoverNota(value)}
                  onMouseLeave={() => isAutenticado && setHoverNota(0)}
                  onClick={() => isAutenticado && setNota(value)}
                  className={[
                    "rounded-md p-1 transition",
                    isAutenticado
                      ? "hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                      : "cursor-not-allowed",
                  ].join(" ")}
                  aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
                >
                  <Star
                    className={[
                      "h-6 w-6 transition",
                      ativo ? "text-yellow-400" : "text-zinc-600",
                    ].join(" ")}
                    fill={ativo ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-sm text-zinc-300">
            {notaVisivel > 0 ? `${notaVisivel}/5` : "—"}
          </span>
        </div>

        {/* Comment */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-200">
            Comentário
          </label>

          <textarea
            value={comentario}
            onChange={(e) => {
              const v = e.target.value;
              if (v.length <= 500) setComentario(v);
              else setComentario(v.slice(0, 500));
            }}
            disabled={!isAutenticado || loading}
            rows={4}
            placeholder={
              isAutenticado
                ? "Escreva sua opinião (até 500 caracteres)..."
                : "Faça login para escrever um comentário..."
            }
            className={[
              "w-full resize-none rounded-xl border bg-zinc-950/40 p-3 text-sm text-zinc-100 outline-none transition",
              "border-white/10 placeholder:text-zinc-500",
              "focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30",
              !isAutenticado ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
          />

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              {charsRestantes} caracteres restantes
            </span>
            {!isAutenticado ? (
              <span className="text-zinc-500">Autenticação necessária</span>
            ) : null}
          </div>
        </div>

        {/* Feedback */}
        {erro ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {erro}
          </p>
        ) : null}

        {sucesso ? (
          <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {sucesso}
          </p>
        ) : null}

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={desabilitado}
            className={[
              "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
              desabilitado
                ? "cursor-not-allowed bg-zinc-800 text-zinc-400"
                : "bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60",
            ].join(" ")}
          >
            {loading ? "Enviando..." : "Enviar avaliação"}
          </button>

          <span className="text-xs text-zinc-500">
            {isAutenticado
              ? "Sua avaliação aparecerá no jogo."
              : "Entre para avaliar."}
          </span>
        </div>
      </form>
    </section>
  );
}
