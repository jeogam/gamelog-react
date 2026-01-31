"use client";

import { useEffect, useMemo, useState, Suspense } from "react"; // <--- Importe Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { searchGames, importGame, SearchResult } from "@/services/gameService";
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

// 1. Criamos um componente INTERNO para segurar a lógica da busca
function BuscaContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // <--- O useSearchParams fica AQUI dentro

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

  useEffect(() => {
    setSearchTerm(initialQ);
  }, [initialQ]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const perfil = await perfilService.getMeuPerfil();
        if ((perfil as any)?.usuarioId)
          setUsuarioLogadoId(String((perfil as any).usuarioId));
      } catch {
        // não logado -> ok
      }
    }
    fetchUser();
  }, []);

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

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/busca?q=${encodeURIComponent(q)}`);
  };

  const handleViewDetails = async (game: SearchResult) => {
    if (!usuarioLogadoId) {
      alert("Faça login para ver detalhes.");
      router.push("/login");
      return;
    }

    setImportingId(game.id);
    try {
      const jogoSalvo = await importGame(game);
      router.push(`/jogo/${jogoSalvo.id}`);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Erro ao abrir detalhes.");
    } finally {
      setImportingId(null);
    }
  };

  return (
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
              onViewDetails={handleViewDetails}
              isLoading={importingId === game.id}
            />
          ))}
      </div>
    </div>
  );
}

// 2. O componente PRINCIPAL agora só tem o Suspense e o Título
export default function BuscaPage() {
  return (
    <main className="app-container py-10 sm:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Explorar Catálogo <span className="text-[#E839C2]">.</span>
        </h1>
      </div>

      {/* AQUI ESTÁ A CORREÇÃO: O Suspense envolve o componente que usa useSearchParams */}
      <Suspense
        fallback={
          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-[#E839C2]" />
          </div>
        }
      >
        <BuscaContent />
      </Suspense>
    </main>
  );
}