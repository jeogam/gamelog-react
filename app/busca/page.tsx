// app/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Importante para o redirecionamento
import { searchGames, importGame, SearchResult } from '@/services/gameService';
import GameCard from '@/components/GameCard';
import GameCardSkeleton from '@/components/GameCardSkeleton';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BuscaPage() {
  const router = useRouter(); // Instancia o roteador
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
          console.error("Erro busca:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }
    performSearch();
  }, [debouncedSearchTerm]);

  // 🟢 LÓGICA DO CLIQUE
  const handleImport = async (game: SearchResult) => {
    setImportingId(game.id); // Ativa o estado de loading no botão específico
    try {
      // 1. Chama o serviço (POST)
      const novoJogo = await importGame(game);
      
      // 2. Sucesso: Redireciona para a página de detalhes usando o UUID interno
      // Ex: /jogo/550e8400-e29b-41d4-a716-446655440000
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
          <input
            type="text"
            className="form-control form-control-lg text-center"
            placeholder="Digite o nome do jogo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
               background: '#21262D', color: '#fff', 
               border: '1px solid #30363d', borderRadius: '50px', 
               padding: '1.2rem', fontSize: '1.2rem'
            }}
          />
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {loading && Array.from({ length: 4 }).map((_, i) => (
             <div className="col" key={i}><GameCardSkeleton /></div>
        ))}

        {!loading && results.map((game) => (
          <div className="col" key={game.id}>
            {/* Passamos a função handleImport para o componente */}
            <GameCard 
                game={game} 
                onImport={handleImport} 
                isImporting={importingId === game.id} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}