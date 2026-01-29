"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchGames, importGame, SearchResult } from "@/services/gameService";
import { bibliotecaService } from "@/services/bibliotecaService";
import { perfilService } from "@/services/perfilService";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";

// Hook de Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BuscaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lê o ?q= da URL (padrão da navbar)
  const initialQ = useMemo(
    () => (searchParams.get("q") || "").trim(),
    [searchParams],
  );

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);

  const [usuarioLogadoId, setUsuarioLogadoId] = useState<string | null>(null);

  // Se a URL mudar (ex: usuário pesquisou pela navbar), sincroniza o input
  useEffect(() => {
    setSearchTerm(initialQ);
  }, [initialQ]);

  // Descobre usuário logado
  useEffect(() => {
    async function fetchUser() {
      try {
        const perfil = await perfilService.getMeuPerfil();
        if (perfil?.usuarioId) setUsuarioLogadoId(perfil.usuarioId);
      } catch {
        // não logado -> ok
      }
    }
    fetchUser();
  }, []);

  // Busca
  useEffect(() => {
    async function performSearch() {
      const term = debouncedSearchTerm.trim();

      if (term.length >= 2) {
        setLoading(true);
        try {
          const data = await searchGames(term);
          setResults(data);
        } catch (error) {
          console.error("Erro busca:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }

    performSearch();
  }, [debouncedSearchTerm]);

  // Enter => /busca?q=...
  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/busca?q=${encodeURIComponent(q)}`);
  };

  // Importar + vincular biblioteca
  const handleImport = async (game: SearchResult) => {
    if (!usuarioLogadoId) {
      alert("Você precisa estar logado para adicionar jogos!");
      router.push("/login");
      return;
    }

    setImportingId(game.id);
    try {
      const jogoSalvo = await importGame(game);

      await bibliotecaService.adicionarJogo({
        usuarioId: usuarioLogadoId,
        jogoId: jogoSalvo.id,
        status: "QUERO_JOGAR",
        favorito: false,
      });

      alert(`"${game.name}" foi adicionado à sua biblioteca!`);
      router.push("/home");
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes("já está na biblioteca")) {
        alert("Você já possui esse jogo na sua biblioteca.");
      } else {
        alert(`Erro ao adicionar: ${error?.message || "Erro inesperado"}`);
      }
    } finally {
      setImportingId(null);
    }
  };

  return (
    <main className="app-container py-10 sm:py-12">
      {/* Cabeçalho */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Explorar Catálogo <span className="text-[#E839C2]">.</span>
        </h1>
      </div>

      {/* Resultado / estado vazio */}
      <div className="mt-10">
        {!loading && results.length === 0 && searchTerm.trim().length < 2 && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-white/70">
              Digite pelo menos{" "}
              <span className="text-white/85 font-medium">2 caracteres</span>{" "}
              para começar.
            </p>
          </div>
        )}

        {!loading && results.length === 0 && searchTerm.trim().length >= 2 && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-white/75">Nenhum jogo encontrado para:</p>
            <p className="mt-1 text-white font-semibold">
              “{searchTerm.trim()}”
            </p>
          </div>
        )}

        {/* Grid de cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}

          {!loading &&
            results.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onImport={handleImport}
                isImporting={importingId === game.id}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
