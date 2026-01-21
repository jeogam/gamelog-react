'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchGames, importGame, SearchResult } from '@/services/gameService';
import { bibliotecaService } from '@/services/bibliotecaService'; // 👈 Novo import
import { perfilService } from '@/services/perfilService'; // 👈 Para pegar o ID do user
import GameCard from '@/components/GameCard';
import GameCardSkeleton from '@/components/GameCardSkeleton';

// Hook de Debounce (manteve igual)
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
  
  // Estado para guardar o ID do usuário logado
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  // 1️⃣ Ao carregar a página, descobre quem é o usuário
  useEffect(() => {
    async function fetchUser() {
        try {
            const perfil = await perfilService.getMeuPerfil();
            if (perfil && perfil.id) {
                setUsuarioLogadoId(perfil.id);
            }
        } catch (error) {
            console.error("Usuário não logado ou erro ao buscar perfil");
            // Opcional: router.push('/login');
        }
    }
    fetchUser();
  }, []);

  // Busca de jogos (manteve igual)
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

  // 🟢 2️⃣ NOVA LÓGICA DO CLIQUE (IMPORTAR + VINCULAR)
  const handleImport = async (game: SearchResult) => {
    if (!usuarioLogadoId) {
        alert("Você precisa estar logado para adicionar jogos!");
        router.push('/login');
        return;
    }

    setImportingId(game.id);
    try {
      // PASSO A: Importar o jogo para o banco local (Tabela Jogos)
      // O Back-end verifica se já existe e devolve o UUID
      const jogoSalvo = await importGame(game);
      console.log("Jogo salvo/recuperado com UUID:", jogoSalvo.id);

      // PASSO B: Vincular o jogo à biblioteca do usuário (Tabela Biblioteca)
      await bibliotecaService.adicionarJogo({
          usuarioId: usuarioLogadoId,
          jogoId: jogoSalvo.id, // Usa o UUID retornado pelo passo A
          status: 'QUERO_JOGAR', // Status padrão ao adicionar
          favorito: false
      });
      
      alert(`"${game.name}" foi adicionado à sua biblioteca!`);
      
      // Redireciona para a biblioteca (Home) ou Detalhes
      router.push('/home'); 
      
    } catch (error: any) {
      console.error(error);
      // Tratamento amigável: Se o jogo já estiver na lib, avisa o usuário
      if (error.message?.includes("já está na biblioteca")) {
          alert("Você já possui esse jogo na sua biblioteca.");
      } else {
          alert(`Erro ao adicionar: ${error.message}`);
      }
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