// app/jogo/[id]/page.tsx
'use client';

import { useEffect, useState, use } from 'react'; // 'use' é necessário no Next 15+ para params assíncronos
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchGameDetails } from '@/services/gameService';
import { Game } from '@/interfaces/Game';

// No Next.js 15, params é uma Promise
export default function JogoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  // Desembrulha a promise dos parâmetros (se estiver usando Next 13/14, pode ser apenas params.id direto)
  const { id } = use(params); 
  
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGame() {
      try {
        const data = await fetchGameDetails(id);
        setGame(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes do jogo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <div className="spinner-border text-primary me-3" style={{width: '3rem', height: '3rem'}} role="status"></div>
        <span className="fs-4">Carregando Jogo...</span>
      </div>
    );
  }

  // Error State
  if (error || !game) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="text-danger mb-4">{error || 'Jogo não encontrado'}</h2>
        <button onClick={() => router.push('/busca')} className="btn btn-outline-light btn-lg">
          Voltar para Busca
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
        
        {/* Botão Voltar */}
        <div className="mb-4">
            <button 
                onClick={() => router.back()} 
                className="btn btn-link text-decoration-none text-light ps-0"
            >
                &larr; Voltar
            </button>
        </div>

        <div className="row g-5">
            
            {/* COLUNA ESQUERDA: CAPA */}
            <div className="col-lg-4">
                <div className="card border-0 shadow-lg overflow-hidden" style={{ backgroundColor: '#161b22' }}>
                     <div className="position-relative w-100" style={{ minHeight: '450px' }}>
                        {game.capaUrl ? (
                            <Image 
                                src={game.capaUrl} 
                                alt={`Capa de ${game.titulo}`} 
                                fill 
                                style={{ objectFit: 'cover' }}
                                priority
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white">
                                Sem Capa
                            </div>
                        )}
                     </div>
                </div>
                
                {/* Botões de Ação (Futuros) */}
                <div className="d-grid gap-2 mt-4">
                     <button className="btn fw-bold text-white" style={{ backgroundColor: '#E839C2' }}>
                        Adicionar à Lista
                     </button>
                     <button className="btn btn-outline-secondary">
                        Editar Informações
                     </button>
                </div>
            </div>

            {/* COLUNA DIREITA: DETALHES */}
            <div className="col-lg-8 text-light">
                <h1 className="display-4 fw-bold mb-2 text-white">
                    {game.titulo}
                </h1>
                
                {/* Badges de Info */}
                <div className="d-flex flex-wrap gap-3 mb-5 mt-3">
                    <span className="badge px-3 py-2 rounded-pill border border-secondary text-secondary bg-transparent">
                        📅 {game.anoLancamento || 'Ano Desconhecido'}
                    </span>
                    <span className="badge px-3 py-2 rounded-pill border border-secondary text-secondary bg-transparent">
                        🎮 {game.plataformas || 'Plataforma não definida'}
                    </span>
                    <span className="badge px-3 py-2 rounded-pill border border-secondary text-secondary bg-transparent">
                        🏷️ {game.genero || 'Gênero não definido'}
                    </span>
                </div>

                <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: '#21262D', border: '1px solid #30363d' }}>
                    <h4 className="mb-4 text-white border-bottom border-secondary pb-2 d-inline-block">
                        Sinopse
                    </h4>
                    
                    {/* Renderiza HTML se vier da RAWG, ou texto puro */}
                    <div 
                        className="text-muted fs-5"
                        style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ 
                            __html: game.descricao || '<p>Nenhuma descrição disponível para este jogo.</p>' 
                        }}
                    />
                </div>

            </div>
        </div>
    </div>
  );
}