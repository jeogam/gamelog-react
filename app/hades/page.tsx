// app/hades/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { fetchGameDetails } from '@/services/gameService' 

// Certifique-se de que a imagem hades-promo-art.png está na pasta correta
import hadesPromo from '@/images/jogos/hades-promo-art.png' 

// Define metadados dinamicamente (para SSR/SEO)
export async function generateMetadata() {
    // ⚠️ Em uma rota dinâmica real, você usaria os 'params' para buscar os dados.
    const game = await fetchGameDetails('hades-id'); 
    
    return {
        title: `${game.titulo} | GameLog`,
        description: game.descricao.substring(0, 150) + '...',
    }
}


export default async function HadesPage() {

    // 1. Busca de dados no Server (Mock por enquanto)
    const game = await fetchGameDetails('hades-id'); 

    if (!game) {
        return <main className="mt-4 text-center"><h1>Jogo não encontrado.</h1></main>
    }

    return (
        <main className="mt-4">
            <div className="row mb-4">
                <div className="col-12">
                    {/* Dados dinâmicos */}
                    <h1 className="display-4 border-bottom pb-2">{game.titulo}</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {/* Dados dinâmicos */}
                    <p className="lead">{game.descricao}</p>

                    <Image 
                        src={hadesPromo} 
                        className="img-fluid rounded shadow-sm mb-4" 
                        alt={`Arte promocional do jogo ${game.titulo}`} 
                        width={900} 
                        height={500}
                    />

                    <h2 className="mt-4">A Trama: Fuga do Submundo</h2>
                    {/* Manter a seção estática para fins de protótipo */}
                    <p>
                        Você joga como <strong>Zagreus</strong>, o príncipe do Submundo e filho de Hades...
                    </p>
                    
                    {/* ... (restante do texto descritivo) ... */}

                </div>

                <div className="col-lg-4">
                    <div className="card bg-dark text-light border-secondary mb-4">
                        <div className="card-header">
                            Ficha Técnica
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled">
                                <li><strong>Desenvolvedora:</strong> Supergiant Games</li>
                                {/* Dados dinâmicos */}
                                <li><strong>Gênero:</strong> {game.genero}</li>
                                <li><strong>Lançamento:</strong> {game.anoLancamento}</li>
                                <li><strong>Plataformas:</strong> {game.plataformas}</li>
                            </ul>
                        </div>
                    </div>

                    <h3 className="h5">Trailer de Lançamento</h3>
                    <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                        <iframe 
                            width="560" 
                            height="315" 
                            src={game.trailerUrl} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </main>
    )
}