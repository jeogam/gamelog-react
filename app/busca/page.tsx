// app/busca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Para redirecionar após importar
import { searchGames, importGame, SearchResult } from '@/services/gameService';

// Hook de Debounce para não travar a API enquanto digita
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
  const [importingId, setImportingId] = useState<number | null>(null); // Qual jogo está sendo importado

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  // Efeito de Busca
  useEffect(() => {
    async function performSearch() {
      if (debouncedSearchTerm.length >= 2) {
        setLoading(true);
        try {
          const data = await searchGames(debouncedSearchTerm);
          setResults(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }
    performSearch();
  }, [debouncedSearchTerm]);

  // Função do Botão "Adicionar à Biblioteca"
  const handleImport = async (game: SearchResult) => {
    setImportingId(game.id);
    try {
      const novoJogo = await importGame(game);
      alert(`Jogo "${novoJogo.titulo}" adicionado com sucesso!`);
      // Redireciona para a página de detalhes do jogo recém-criado (UUID)
      router.push(`/jogo/${novoJogo.id}`);
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="container py-5">
      {/* Cabeçalho e Input */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <h1 className="fw-bold mb-4" style={{ color: '#F0F6FC' }}>
            Explorar Catálogo <span style={{color: '#E839C2'}}>.</span>
          </h1>
          
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-lg text-center"
              placeholder="Digite para buscar (ex: Zelda, Mario)..."
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
            {loading && (
              <div className="spinner-border text-primary position-absolute" 
                   style={{ right: '20px', top: '30%' }} role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Resultados */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {results.map((game) => (
          <div className="col" key={game.id}>
            <div className="card h-100 border-0 shadow-lg" 
                 style={{ backgroundColor: '#161b22', overflow: 'hidden' }}>
              
              {/* Imagem do Jogo */}
              <div className="position-relative w-100" style={{ height: '200px' }}>
                {game.background_image ? (
                  <Image
                    src={game.background_image}
                    alt={game.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white">
                    Sem Imagem
                  </div>
                )}
              </div>

              {/* Corpo do Card */}
              <div className="card-body d-flex flex-col justify-content-between">
                <div>
                  <h5 className="card-title text-light text-truncate" title={game.name}>
                    {game.name}
                  </h5>
                  <p className="card-text text-muted small">
                    Lançamento: {game.released ? game.released.substring(0,4) : 'N/A'}
                  </p>
                </div>

                <div className="mt-3 d-grid">
                  {/* BOTÃO IMPORTAR (Solução 1) */}
                  <button 
                    onClick={() => handleImport(game)}
                    disabled={importingId === game.id}
                    className="btn btn-primary fw-bold"
                    style={{ 
                        backgroundColor: importingId === game.id ? '#30363d' : '#E839C2', 
                        border: 'none' 
                    }}
                  >
                    {importingId === game.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Salvando...
                        </>
                    ) : (
                        'Adicionar à Biblioteca'
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && searchTerm.length > 2 && (
         <div className="text-center text-muted mt-5">
            <h4>Nenhum jogo encontrado. Tente outro termo!</h4>
         </div>
      )}
    </div>
  );
}