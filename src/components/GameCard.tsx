// src/components/GameCard.tsx
import Image from 'next/image';
import { SearchResult } from '@/services/gameService';

interface GameCardProps {
  game: SearchResult;
  onImport: (game: SearchResult) => void;
  isImporting: boolean; // Para mostrar o loading no botão específico
}

export default function GameCard({ game, onImport, isImporting }: GameCardProps) {
  return (
    <div className="card h-100 border-0 shadow-lg" 
         style={{ backgroundColor: '#161b22', overflow: 'hidden', transition: 'transform 0.2s' }}>
      
      {/* Capa */}
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

      {/* Conteúdo */}
      <div className="card-body d-flex flex-col justify-content-between">
        <div>
          <h5 className="card-title text-light text-truncate" title={game.name}>
            {game.name}
          </h5>
          <p className="card-text text-muted small">
            Lançamento: {game.released ? game.released.substring(0,4) : 'N/A'}
          </p>
        </div>

        {/* Ação de Clique (Botão de Importar) */}
        <div className="mt-3 d-grid">
          <button 
            onClick={() => onImport(game)}
            disabled={isImporting}
            className="btn fw-bold text-white"
            style={{ 
                backgroundColor: isImporting ? '#30363d' : '#E839C2', 
                border: 'none',
                transition: 'all 0.3s'
            }}
          >
            {isImporting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Salvando...
                </>
            ) : (
                'Adicionar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}