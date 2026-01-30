"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { perfilService } from "@/services/perfilService";
import type { Perfil } from "@/interfaces/Perfil";
import PerfilView from "@/components/PerfilView";

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    perfilService
      .getMeuPerfil()
      .then(setPerfil)
      .catch(console.error)
      .finally(() => setLoading(false));
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
