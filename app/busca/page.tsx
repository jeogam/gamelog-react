// app/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { searchGames, importGame, SearchResult } from '@/services/gameService';
import GameCard from '@/components/GameCard';
import GameCardSkeleton from '@/components/GameCardSkeleton';

// Hook de Debounce (mantido)
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
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  useEffect(() => {
    async function performSearch() {
      if (debouncedSearchTerm.length >= 2) {
        setLoading(true);
        try {
          const data = await searchGames(debouncedSearchTerm);
          setResults(data);
        } catch (error) {
          console.error("Erro ao buscar:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }
    performSearch();
  }, [debouncedSearchTerm]);

  // Ação de Clique: Importar e Redirecionar
  const handleImport = async (game: SearchResult) => {
    setImportingId(game.id);
    try {
      const novoJogo = await importGame(game);
      // Redireciona para a página de detalhes usando o ID interno (UUID)
      router.push(`/jogo/${novoJogo.id}`);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <h1 className="fw-bold mb-4" style={{ color: '#F0F6FC' }}>
            Explorar Catálogo <span style={{color: '#E839C2'}}>.</span>
          </h1>
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-lg text-center"
              placeholder="Digite o nome do jogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: '#21262D',
                border: '1px solid #30363d',
                color: '#fff',
                borderRadius: '50px',
                padding: '1.2rem',
                fontSize: '1.2rem',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Grade de Resultados */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        
        {/* Renderiza Skeletons enquanto carrega */}
        {loading && Array.from({ length: 8 }).map((_, i) => (
            <div className="col" key={i}>
                <GameCardSkeleton />
            </div>
        ))}

        {/* Renderiza Cards Reais */}
        {!loading && results.map((game) => (
          <div className="col" key={game.id}>
            <GameCard 
                game={game} 
                onImport={handleImport} 
                isImporting={importingId === game.id} 
            />
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && searchTerm.length > 2 && (
         <div className="text-center text-muted mt-5">
            <p className="fs-5">Nenhum jogo encontrado.</p>
         </div>
      )}
    </div>
  );
}