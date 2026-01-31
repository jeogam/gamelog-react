"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { perfilService } from "@/services/perfilService";
import { perfilStatsService } from "@/services/perfilStatsService";
import type { Perfil } from "@/interfaces/Perfil";
import PerfilView from "@/components/PerfilView";

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const meu = await perfilService.getMeuPerfil();

        const stats = await perfilStatsService.getStatsByUsuarioId(String(meu.usuarioId));

        // ✅ injeta stats no perfil (PerfilView já lê perfil.stats)
        setPerfil({ ...meu, stats });
      } catch (e) {
        console.error(e);
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-10">
        <main className="container mx-auto px-4 py-10">
          {loading ? (
            <p className="text-sm text-zinc-400">Carregando...</p>
          ) : perfil ? (
            <PerfilView perfil={perfil} isMeuPerfil />
          ) : (
            <p className="text-sm text-zinc-400">Não foi possível carregar seu perfil.</p>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
