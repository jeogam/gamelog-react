import Image from 'next/image';
import Link from 'next/link';

// Criamos uma interface flexível para o Card aceitar tanto jogos da RAWG quanto do Banco
interface GameCardProps {
  game: {
    id: number | string; // 👈 Aceita number (RAWG) e string (UUID Banco)
    name: string;
    background_image: string;
    released?: string;
  };
  onImport: (game: any) => void;
  isImporting?: boolean;
}

export default function GameCard({ game, onImport, isImporting = false }: GameCardProps) {
  // ... (o resto do código do seu componente continua igual)
  // Só certifique-se de que onde usa o game.id, ele aceita string
  return (
    <div className="card h-100 bg-dark text-white border-secondary shadow-sm hover-effect">
       {/* ... resto do JSX ... */}
       <div className="position-relative w-100" style={{ height: '200px' }}>
         {game.background_image ? (
           <Image src={game.background_image} alt={game.name} fill style={{ objectFit: 'cover' }} />
         ) : (
           <div className="d-flex align-items-center justify-content-center h-100 bg-secondary">?</div>
         )}
       </div>
       <div className="card-body d-flex flex-column">
         <h5 className="card-title text-truncate">{game.name}</h5>
         <p className="small text-muted mb-auto">{game.released?.substring(0, 4) || '---'}</p>
         
         <button 
           className="btn btn-primary mt-3 w-100 fw-bold"
           onClick={() => onImport(game)}
           disabled={isImporting}
         >
           {isImporting ? 'Carregando...' : 'Ver Detalhes'}
         </button>
       </div>
    </div>
  );
}