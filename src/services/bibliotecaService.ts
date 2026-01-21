// src/services/bibliotecaService.ts
import api from './api';

// Enum igual ao do seu Java
export type StatusJogo = 'JOGANDO' | 'ZERADO' | 'QUERO_JOGAR' | 'ABANDONADO';

export interface BibliotecaItemDTO {
    usuarioId: string; 
    jogoId: string;    
    status: StatusJogo;
    favorito: boolean;
}

export const bibliotecaService = {
    // POST /api/v1/bibliotecas/item
    adicionarJogo: async (dados: BibliotecaItemDTO) => {
        const response = await api.post('/bibliotecas/item', dados);
        return response.data;
    },

    // GET /api/v1/bibliotecas/usuario/{id}
    getBibliotecaDoUsuario: async (usuarioId: string) => {
        const response = await api.get(`/bibliotecas/usuario/${usuarioId}`);
        return response.data;
    }
};