'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 🔴 CORREÇÃO AQUI: Importamos a função diretamente, entre chaves
import { getJogosSalvos } from '@/services/gameService'; 

import GameCard from '@/components/GameCard';
import GameCardSkeleton from '@/components/GameCardSkeleton';

// Interface ajustada para o que vem do SEU banco (UUID é string)
interface JogoLocal {
  id: string; 
  titulo: string;
  capaUrl: string;
  genero: string;
  anoLancamento: number;
}

export default function Home() {
  const router = useRouter();
  const [jogos, setJogos] = useState<JogoLocal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJogosLocais() {
      try {
        // 🔴 CORREÇÃO AQUI: Chamamos a função direto, sem "gameService." antes
        const data: any = await getJogosSalvos(); 
        setJogos(data);
      } catch (error) {
        console.error("Erro ao carregar biblioteca:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJogosLocais();
  }, []);

  const handleCardClick = (id: string | number) => {
    router.push(`/jogo/${id}`);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold" style={{ color: '#F0F6FC' }}>
        Sua Biblioteca de Jogos
      </h2>

      {loading ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
           <GameCardSkeleton />
           <GameCardSkeleton />
           <GameCardSkeleton />
        </div>
      ) : jogos.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p>Nenhum jogo na biblioteca ainda.</p>
          <a href="/busca" className="btn btn-outline-primary">
            Importar Jogos
          </a>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {jogos.map((jogo) => (
            <div className="col" key={jogo.id}>
              <GameCard 
                game={{
                    id: jogo.id,
                    name: jogo.titulo,
                    background_image: jogo.capaUrl,
                    released: String(jogo.anoLancamento)
                }}
                onImport={() => handleCardClick(jogo.id)}
                isImporting={false} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}