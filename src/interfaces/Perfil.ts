export interface Perfil {
    id: string; 
    nomeExibicao: string;
    biografia?: string;
    avatarImagem?: string;
    usuarioId: string;
}

export interface PerfilUpdateDTO {
    nomeExibicao?: string;
    biografia?: string;
    avatarImagem?: string;
}