"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { Perfil } from "@/interfaces/Perfil";
import { perfilService } from "@/services/perfilService";
import { perfilStatsService } from "@/services/perfilStatsService";
import PerfilView from "@/components/PerfilView";

export default function PerfilPublicoPage() {
  const params = useParams<{ id: string }>();
  const usuarioId = params?.id;

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [meuUsuarioId, setMeuUsuarioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!usuarioId) return;

      setLoading(true);
      setErro(null);

      try {
        const meuPerfilPromise = perfilService
          .getMeuPerfil()
          .then((meu) => {
            setMeuUsuarioId(meu.usuarioId);
            return meu;
          })
          .catch(() => {
            setMeuUsuarioId(null);
            return null;
          });

        const [_, publico, statsResult] = await Promise.all([
          meuPerfilPromise,
          perfilService.getPerfilPublico(String(usuarioId)),
          perfilStatsService.getStatsByUsuarioId(String(usuarioId)),
        ]);

        // ✅ injeta stats no perfil (PerfilView já lê perfil.stats)
        setPerfil({ ...publico, stats: statsResult });
      } catch (e: any) {
        setErro(e?.response?.data?.message || "Não foi possível carregar o perfil.");
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [usuarioId]);

  const isMeuPerfil = useMemo(
    () => Boolean(meuUsuarioId && usuarioId && String(meuUsuarioId) === String(usuarioId)),
    [meuUsuarioId, usuarioId]
  );

  return (
    <div className="min-h-screen pb-10">
      <main className="container mx-auto px-4 py-10">
        {loading ? (
          <p className="text-sm text-zinc-400">Carregando...</p>
        ) : erro ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {erro}
          </p>
        ) : perfil ? (
          <PerfilView perfil={perfil} isMeuPerfil={isMeuPerfil} />
        ) : (
          <p className="text-sm text-zinc-400">Perfil não encontrado.</p>
        )}
      </main>
    </div>
  );
}
