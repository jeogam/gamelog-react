import { Game } from '@/interfaces/Game';

// Endereço do seu Back-end Spring Boot
const BASE_API_URL = 'http://localhost:8080/api/v1/jogos'; 

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

// 1. Busca externa
export async function searchGames(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    try {
        const response = await fetch(`${BASE_API_URL}/pesquisar-externo?nome=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Erro no searchGames:", error);
        return [];
    }
}

// 2. Importar jogo
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

    const response = await fetch(`${BASE_API_URL}/jogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        if (response.status === 422) throw new Error('Este jogo já foi adicionado à sua biblioteca.');
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao importar o jogo.');
    }
    return await response.json();
}

// 3. Detalhes do jogo (Pelo UUID)
export async function fetchGameDetails(gameId: string): Promise<Game> {
    if (!gameId) throw new Error('ID do jogo inválido');
    const response = await fetch(`${BASE_API_URL}/jogo/${gameId}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Jogo não encontrado (Status: ${response.status})`);
    return response.json(); 
}

// 4. 👇 NOVA FUNÇÃO: Listar todos os jogos salvos (Biblioteca)
export async function getJogosSalvos(): Promise<Game[]> {
    // GET http://localhost:8080/api/v1/jogos
    const response = await fetch(`${BASE_API_URL}`, { cache: 'no-store' });
    
    if (!response.ok) {
        throw new Error('Erro ao buscar jogos da biblioteca.');
    }
    return response.json();
}