"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { bibliotecaService } from "@/services/bibliotecaService";
import { perfilService } from "@/services/perfilService";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";

type StatusJogo = "QUERO_JOGAR" | "JOGANDO" | "FINALIZADO" | "DESISTIDO";

interface ItemBiblioteca {
  id: string;
  jogoId: string;
  tituloJogo: string;
  capaUrl: string;
  status: StatusJogo;
  favorito?: boolean;
}

export default function BibliotecaPage() {
  const router = useRouter();
  const [biblioteca, setBiblioteca] = useState<ItemBiblioteca[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = useCallback(async () => {
    try {
      setLoading(true);
      const perfil = await perfilService.getMeuPerfil();

      const usuarioId = String((perfil as any)?.usuarioId);
      if (!usuarioId) {
        router.push("/login");
        return;
      }

      const dadosBrutos = await bibliotecaService.getBibliotecaDoUsuario(usuarioId);

      const dadosFormatados: ItemBiblioteca[] = dadosBrutos.map((item: any) => ({
        id: String(item.id),
        jogoId: String(item.jogoId ?? item.jogo?.id),
        tituloJogo: item.tituloJogo ?? item.jogo?.titulo ?? "Sem título",
        capaUrl: item.capaUrl ?? item.jogo?.capaUrl ?? "",
        status: item.status as StatusJogo,
        favorito: Boolean(item.favorito),
      }));

      setBiblioteca(dadosFormatados);
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {biblioteca.map((item) => (
        <GameCard
          key={item.id}
          game={{
            id: item.jogoId,
            name: item.tituloJogo,
            background_image: item.capaUrl,
            status: item.status,       // ✅ agora aparece
            favorito: item.favorito,
          }}
          onViewDetails={() => router.push(`/jogo/${item.jogoId}`)}
          isLoading={false}
        />
      ))}
    </div>
  );
}
