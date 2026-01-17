// src/services/gameService.ts

import { Game } from '@/interfaces/Game';

const BASE_API_URL = 'http://localhost:8080/api/v1/jogos'; 

export interface SearchResult {
    id: number;
    name: string;
    background_image: string;
    released: string;
}

// DTO para enviar ao Back-end na hora de importar
export interface GameImportDTO {
    idExterno: number;
    titulo: string;
    capaUrl: string;
    descricao?: string; // Opcional, pois a lista as vezes não tem
    anoLancamento?: number;
    genero?: string; // Simplificado
}

// 1. Busca Jogos na API Externa (via Back-end)
export async function searchGames(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    try {
        const response = await fetch(`${BASE_API_URL}/pesquisar-externo?nome=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Erro na busca externa');
        return await response.json();
    } catch (error) {
        console.error("Erro no searchGames:", error);
        return [];
    }
}

// 2. Importar/Salvar Jogo no Banco de Dados (SOLUÇÃO 1 - Botão Importar)
export async function importGame(gameData: SearchResult): Promise<Game> {
    
    // Prepara o objeto conforme o JogoCriarRequestDTO do Java
    const payload: GameImportDTO = {
        idExterno: gameData.id,
        titulo: gameData.name,
        capaUrl: gameData.background_image,
        // Pegando o ano da string "YYYY-MM-DD"
        anoLancamento: gameData.released ? parseInt(gameData.released.substring(0, 4)) : undefined,
        descricao: `Importado da RAWG: ${gameData.name}` // Descrição placeholder se não tivermos a full
    };

    const response = await fetch(`${BASE_API_URL}/jogo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // Se der erro (ex: jogo já existe), lançamos para tratar na tela
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao importar jogo');
    }

    return await response.json();
}