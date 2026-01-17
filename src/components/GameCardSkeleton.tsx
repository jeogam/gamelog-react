// src/components/GameCardSkeleton.tsx
export default function GameCardSkeleton() {
  return (
    <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#161b22' }}>
      {/* Skeleton da Imagem */}
      <div className="w-100 bg-secondary opacity-25 animate-pulse" style={{ height: '200px' }}></div>
      
      <div className="card-body">
        {/* Skeleton do Título */}
        <div className="h-5 bg-secondary opacity-25 rounded w-75 mb-3 animate-pulse"></div>
        {/* Skeleton do Ano */}
        <div className="h-4 bg-secondary opacity-25 rounded w-25 mb-4 animate-pulse"></div>
        {/* Skeleton do Botão */}
        <div className="h-10 bg-secondary opacity-25 rounded w-100 animate-pulse"></div>
      </div>
    </div>
  );
}