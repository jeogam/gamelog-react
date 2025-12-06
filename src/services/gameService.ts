// src/services/gameService.ts

import { Game } from '@/interfaces/Game';

// Endereço do seu Back-end Spring Boot
const BASE_API_URL = 'http://localhost:8080/api/v1/jogos'; 

const HADES_MOCK_DATA: Game = {
    id: 'f0022f43-8f0a-4c28-98e3-0d268579914d',
    titulo: 'Hades',
    capaUrl: '/_next/image?url=%2Fhades-promo-art.png&w=1080&q=75', // Mock de URL
    descricao: 'Hades é um jogo eletrônico de ação e RPG do gênero roguelike desenvolvido e publicado pela Supergiant Games. Aclamado pela crítica, o jogo venceu diversos prêmios de "Jogo do Ano" (GOTY) e é conhecido por sua jogabilidade viciante, direção de arte deslumbrante e uma narrativa que se desenrola a cada tentativa de fuga.',
    anoLancamento: 2020,
    plataformas: 'PC, Nintendo Switch, PlayStation, Xbox',
    genero: 'Roguelike, Ação RPG',
    trailerUrl: 'https://www.youtube.com/embed/91t0ha9x0AE?si=U1mtoqZt3W3AeS1L',
}

// Futuramente, esta função buscará pelo ID real (UUID)
export async function fetchGameDetails(gameId: string): Promise<Game> {
    
    // ⚠️ CHAMA SEU BACK-END REAL:
    // const response = await fetch(`${BASE_API_URL}/jogo/${gameId}`);
    // if (!response.ok) {
    //     throw new Error(`Falha ao buscar o jogo: ${gameId}`);
    // }
    // return response.json(); 
    
    // Por enquanto, retorna o mock para rodar o Front-end
    if (gameId.includes('hades')) {
        return HADES_MOCK_DATA;
    }
    throw new Error('Jogo não encontrado ou não implementado.');
}