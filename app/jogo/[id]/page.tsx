'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// 🔴 CORREÇÃO: Importamos a função direta entre chaves {}, não o objeto gameService
import { fetchGameDetails } from '@/services/gameService';
import Image from 'next/image';

export default function JogoDetalhes() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame() {
      try {
        // 🔴 CORREÇÃO: Chamamos a função diretamente
        const dados = await fetchGameDetails(id as string);
        setGame(dados);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
        loadGame();
    }
  }, [id]);

  if (loading) return <div className="text-center text-white mt-5">Carregando...</div>;
  if (!game) return <div className="text-center text-white mt-5">Jogo não encontrado.</div>;

  // Link para traduzir a descrição no Google Tradutor
  const googleTranslateUrl = `https://translate.google.com/?sl=en&tl=pt&text=${encodeURIComponent(game.descricao || '')}&op=translate`;

  return (
    <div className="container py-5 text-white">
      {/* Cabeçalho com Imagem de Fundo (Blur) */}
      <div className="position-relative mb-5" style={{ minHeight: '400px', borderRadius: '20px', overflow: 'hidden' }}>
         {game.capaUrl && (
             <Image 
                src={game.capaUrl} 
                alt={game.titulo} 
                fill 
                style={{ objectFit: 'cover', opacity: 0.3, zIndex: 0 }} 
             />
         )}
         <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-5" style={{ zIndex: 1, background: 'linear-gradient(to top, #0D1117, transparent)' }}>
            <div className="d-flex align-items-end gap-4">
                {game.capaUrl ? (
                    <img src={game.capaUrl} alt="Capa" style={{ width: '200px', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} />
                ) : (
                    <div style={{ width: '200px', height: '300px', background: '#333', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Sem Capa</div>
                )}
                
                <div>
                    <h1 className="display-4 fw-bold">{game.titulo}</h1>
                    <p className="lead">{game.genero || 'Gênero não informado'} • {game.anoLancamento || 'Ano desconhecido'}</p>
                </div>
            </div>
         </div>
      </div>

      {/* Sinopse */}
      <div className="row">
          <div className="col-md-8">
              <h3 className="mb-3 border-bottom border-secondary pb-2">Sinopse</h3>
              
              {/* Descrição em Inglês */}
              <div className="bg-dark p-4 rounded text-light-50 mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                  {/* remove tags HTML que a RAWG manda as vezes */}
                  {game.descricao?.replace(/<[^>]*>?/gm, '') || 'Sem descrição disponível.'}
              </div>

              {/* Botão de Tradução */}
              <a href={googleTranslateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                 🌐 Traduzir Sinopse (Google Tradutor)
              </a>
          </div>

          <div className="col-md-4">
              <div className="card bg-secondary text-white p-3 border-0">
                  <h5 className="card-title mb-3">Informações</h5>
                  <ul className="list-unstyled">
                      <li className="mb-2"><strong>Plataformas:</strong> <br/> {game.plataformas || 'Não informado'}</li>
                      <li className="mb-2"><strong>Lançamento:</strong> <br/> {game.anoLancamento}</li>
                      <li className="mb-2"><strong>ID Interno:</strong> <br/> <small className="text-muted">{game.id}</small></li>
                  </ul>
              </div>
          </div>
      </div>
    </div>
  );
}