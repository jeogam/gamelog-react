// src/services/gameService.ts

import { Game } from '@/interfaces/Game';

// Endereço do seu Back-end Spring Boot
const BASE_API_URL = 'http://localhost:8080/api/v1/jogos'; 

// Interface para o resultado da busca (RAWG via Back-end)
export interface SearchResult {
    id: number;       // ID Numérico da RAWG
    name: string;
    background_image: string;
    released: string;
}

// DTO para enviar ao Back-end na hora de importar
export interface GameImportDTO {
    idExterno: number;
    titulo: string;
    capaUrl: string;
    descricao?: string; 
    anoLancamento?: number;
    genero?: string;
}

/**
 * 1. Busca Jogos na API Externa (via Back-end)
 * Endpoint: GET /jogos/pesquisar-externo?nome=...
 */
export async function searchGames(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    try {
        const response = await fetch(`${BASE_API_URL}/pesquisar-externo?nome=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`Erro na busca externa: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Erro no searchGames:", error);
        return [];
    }
}

/**
 * 2. Importar/Salvar Jogo no Banco de Dados Local
 * Endpoint: POST /jogos/jogo
 */
export async function importGame(gameData: SearchResult): Promise<Game> {
    
    // Prepara o objeto payload conforme o JogoCriarRequestDTO do Java
    const payload: GameImportDTO = {
        idExterno: gameData.id,
        titulo: gameData.name,
        capaUrl: gameData.background_image,
        // Extrai o ano da string "YYYY-MM-DD"
        anoLancamento: gameData.released ? parseInt(gameData.released.substring(0, 4)) : undefined,
        descricao: `Importado da RAWG: ${gameData.name}` // Descrição temporária
    };

    const response = await fetch(`${BASE_API_URL}/jogo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // Tenta ler a mensagem de erro do backend
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao importar o jogo.');
    }

    return await response.json();
}

/**
 * 3. Busca detalhes de um jogo salvo no banco local pelo UUID
 * Endpoint: GET /jogos/jogo/{id}
 */
export async function fetchGameDetails(gameId: string): Promise<Game> {
    const response = await fetch(`${BASE_API_URL}/jogo/${gameId}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Jogo não encontrado (Status: ${response.status})`);
    }
    return response.json(); 
}