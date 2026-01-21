// src/services/gameService.ts
import api from './api'; // 👈 Importe o Axios configurado
import { Game } from '@/interfaces/Game';

// Removemos a BASE_API_URL fixa, pois o api do axios já tem a baseURL configurada
// Se precisar forçar rota específica, use '/jogos/...'

export interface SearchResult {
    id: number;
    name: string;
    background_image: string;
    released: string;
}

export interface GameImportDTO {
    idExterno: number;
    titulo: string;
    capaUrl: string;
    descricao?: string; 
    anoLancamento?: number;
    genero?: string;
    plataformas?: string;
}

// 1. Busca externa (GET)
export async function searchGames(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    try {
        // Usa api.get em vez de fetch
        const response = await api.get(`/jogos/pesquisar-externo`, {
            params: { nome: query }
        });
        return response.data;
    } catch (error) {
        console.error("Erro no searchGames:", error);
        return [];
    }
}

// 2. Importar jogo (POST) - AGORA COM TOKEN AUTOMÁTICO
export async function importGame(gameData: SearchResult): Promise<Game> {
    const payload: GameImportDTO = {
        idExterno: gameData.id,
        titulo: gameData.name,
        capaUrl: gameData.background_image || '', 
        anoLancamento: gameData.released ? parseInt(gameData.released.substring(0, 4)) : undefined,
        descricao: `Importado da RAWG: ${gameData.name}`, 
        genero: 'Importado',          
        plataformas: 'Multiplataforma' 
    };

    try {
        // Usa api.post para garantir autenticação
        const response = await api.post('/jogos/jogo', payload);
        return response.data;
    } catch (error: any) {
        // Tratamento de erro do Axios
        if (error.response?.status === 422) {
             throw new Error('Este jogo já foi adicionado ao catálogo global.');
        }
        throw new Error(error.response?.data?.message || 'Falha ao importar o jogo.');
    }
}

// 3. Detalhes do jogo (GET)
export async function fetchGameDetails(gameId: string): Promise<Game> {
    if (!gameId) throw new Error('ID do jogo inválido');
    const response = await api.get(`/jogos/jogo/${gameId}`);
    return response.data;
}

// 4. Listar jogos salvos (GET)
export async function getJogosSalvos(): Promise<Game[]> {
    const response = await api.get('/jogos'); // Endpoint base do controller
    return response.data;
}