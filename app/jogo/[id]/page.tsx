// app/jogo/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useParams para pegar o ID da URL
import Image from 'next/image';
import { fetchGameDetails } from '@/services/gameService';
import { Game } from '@/interfaces/Game';

export default function JogoDetalhesPage() {
  const { id } = useParams(); // Pega o UUID da rota
  const router = useRouter();
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGame() {
      if (!id) return;
      try {
        // Busca do backend local
        const data = await fetchGameDetails(id as string);
        setGame(data);
      } catch (err) {
        setError('Erro ao carregar o jogo. Verifique se ele existe no banco local.');
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <div className="spinner-border text-primary me-3" role="status"></div>
        <span>Carregando detalhes do jogo...</span>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mt-5 text-center text-danger">
        <h2>{error || 'Jogo não encontrado'}</h2>
        <button onClick={() => router.push('/busca')} className="btn btn-outline-light mt-3">
          Voltar para Busca
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
        {/* Banner / Hero Section */}
        <div className="row g-5">
            
            {/* Coluna da Esquerda: Capa */}
            <div className="col-md-4">
                <div className="position-relative shadow-lg rounded overflow-hidden" style={{ minHeight: '400px' }}>
                     {game.capaUrl ? (
                        <Image 
                            src={game.capaUrl} 
                            alt={game.titulo} 
                            fill 
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                     ) : (
                        <div className="bg-dark h-100 d-flex align-items-center justify-content-center text-muted">
                            Sem Capa
                        </div>
                     )}
                </div>
            </div>

            {/* Coluna da Direita: Informações */}
            <div className="col-md-8 text-light">
                <h1 className="display-4 fw-bold mb-2" style={{ color: '#E839C2' }}>
                    {game.titulo}
                </h1>
                
                <div className="d-flex gap-3 mb-4 text-muted">
                    <span>📅 {game.anoLancamento || 'Ano N/A'}</span>
                    <span>🎮 {game.plataformas || 'Plataformas não informadas'}</span>
                    <span>🏷️ {game.genero || 'Gênero não informado'}</span>
                </div>

                <div className="p-4 rounded mb-4" style={{ backgroundColor: '#21262D', border: '1px solid #30363d' }}>
                    <h4 className="mb-3 text-white">Sinopse</h4>
                    {/* Renderiza HTML da descrição se vier da RAWG, ou texto simples */}
                    <div 
                        className="text-secondary"
                        style={{ lineHeight: '1.6' }}
                        dangerouslySetInnerHTML={{ __html: game.descricao || 'Sem descrição disponível.' }}
                    />
                </div>

                <div className="d-flex gap-3">
                     <button className="btn btn-primary px-4 py-2 fw-bold" style={{ backgroundColor: '#E839C2', borderColor: '#E839C2' }}>
                        Adicionar à Lista
                     </button>
                     <button onClick={() => router.back()} className="btn btn-outline-light px-4 py-2">
                        Voltar
                     </button>
                </div>
            </div>
        </div>
    </div>
  );
}