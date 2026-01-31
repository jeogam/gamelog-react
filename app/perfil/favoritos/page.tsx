"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Heart, Globe } from "lucide-react"; // Use Globe

import { bibliotecaService, BibliotecaResponseDTO } from "@/services/bibliotecaService";
import { perfilService } from "@/services/perfilService";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";

export default function FavoritosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const uidParam = searchParams.get("uid");

  const [jogosFavoritos, setJogosFavoritos] = useState<BibliotecaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setLoading(true);
        let targetId = uidParam;

        if (!targetId) {
          const meuPerfil = await perfilService.getMeuPerfil();
          targetId = String(meuPerfil.usuarioId);
          setNomeUsuario("Seus");
        } else {
            try {
               const p = await perfilService.getPerfilPublico(targetId);
               setNomeUsuario(p.nomeExibicao);
            } catch {
                setNomeUsuario("Usuário");
            }
        }

        const biblioteca = await bibliotecaService.getBibliotecaDoUsuario(targetId);
        const apenasFavoritos = biblioteca.filter(item => item.favorito);
        
        setJogosFavoritos(apenasFavoritos);
      } catch (error) {
        console.error("Erro ao carregar favoritos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [uidParam]);

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <GameCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={20} /> Voltar
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black text-white">Jogos Favoritos</h1>
          <Heart className="text-pink-500 fill-pink-500" size={28} />
        </div>
        
        <div className="flex items-center gap-3 mt-2">
          {/* ✅ MUDANÇA AQUI: Label Pública com ícone Globe */}
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/10 text-green-500 flex items-center gap-1">
            <Globe size={10} /> LISTA PÚBLICA
          </span>
          <span className="text-zinc-500 text-sm">
            {jogosFavoritos.length} {jogosFavoritos.length === 1 ? 'jogo' : 'jogos'} de {nomeUsuario}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {jogosFavoritos.map((item) => {
           const jId = item.jogo?.id || item.jogoId;
           const jTitulo = item.tituloJogo || item.jogo?.titulo;
           const jCapa = item.capaUrl || item.jogo?.capaUrl;

           return (
            <GameCard
              key={item.id}
              game={{
                id: String(jId),
                name: jTitulo || "Sem título",
                background_image: jCapa || "",
                status: item.status,
                favorito: true 
              }}
              onViewDetails={() => router.push(`/jogo/${jId}`)}
              isLoading={false}
            />
          );
        })}

        {jogosFavoritos.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-zinc-900/20">
            <Heart className="mx-auto h-12 w-12 text-zinc-700 mb-3" />
            <p className="text-zinc-500 text-lg">Nenhum jogo favoritado ainda.</p>
            <p className="text-zinc-600 text-sm mt-1">Clique no coração na página do jogo para adicionar aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}