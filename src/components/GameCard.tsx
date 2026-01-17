// src/components/GameCard.tsx
import Image from 'next/image';
import { SearchResult } from '@/services/gameService';

interface GameCardProps {
  game: SearchResult;
  onImport: (game: SearchResult) => void; // A função que vem da Page
  isImporting: boolean;
}

export default function GameCard({ game, onImport, isImporting }: GameCardProps) {
  return (
    <div className="card h-100 border-0 shadow-lg" 
         style={{ backgroundColor: '#161b22', transition: 'transform 0.2s' }}>
      
      <div className="position-relative w-100" style={{ height: '200px' }}>
        {game.background_image ? (
          <Image src={game.background_image} alt={game.name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 bg-secondary text-white">?</div>
        )}
      </div>

      <div className="card-body d-flex flex-col justify-content-between">
        <h5 className="card-title text-light text-truncate">{game.name}</h5>
        
        <div className="mt-3 d-grid">
          {/* Botão que dispara a ação */}
          <button 
            onClick={() => onImport(game)}
            disabled={isImporting}
            className="btn fw-bold text-white"
            style={{ backgroundColor: isImporting ? '#30363d' : '#E839C2', border: 'none' }}
          >
            {isImporting ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}