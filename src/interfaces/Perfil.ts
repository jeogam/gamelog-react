export interface Perfil {
    id: number;
    nomeExibicao: string;
    biografia: string;
    avatarImagem: string;
    usuarioId: string;
}

// Interface para atualização (sem ID, pois é pelo token)
export interface PerfilUpdateDTO {
    nomeExibicao?: string;
    biografia?: string;
    avatarImagem?: string;
}