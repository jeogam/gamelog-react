// src/interfaces/Game.ts

export interface Game {
    id: string;           // UUID do banco local
    idExterno?: number;   // ID da RAWG
    titulo: string;
    capaUrl: string;
    descricao?: string;
    anoLancamento?: number;
    // Adicionando os campos que decidimos manter manuais/simples por enquanto
    genero?: string;      
    plataformas?: string;
}