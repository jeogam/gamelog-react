import api from './api';
import { Perfil, PerfilUpdateDTO } from '../interfaces/Perfil';

export const perfilService = {
    // Busca o perfil do usuário logado
    getMeuPerfil: async (): Promise<Perfil> => {
        // O endpoint correto conforme o Controller Java é /perfis/meu-perfil
        const response = await api.get('/perfis/meu-perfil');
        return response.data;
    },

    // Atualiza o perfil do usuário logado
    updateMeuPerfil: async (dados: PerfilUpdateDTO): Promise<Perfil> => {
        const response = await api.put('/perfis/meu-perfil', dados);
        return response.data;
    }
};