export interface Perfil {
  id: string;
  nomeExibicao: string;
  biografia?: string;
  avatarImagem?: string;

  usuarioId: string;

  // ✅ opcional (pode vir depois)
  stats?: {
    jogos?: number;
    reviews?: number;
    listas?: number;
  };
}

export interface PerfilUpdateDTO {
  nomeExibicao?: string;
  biografia?: string;
  avatarImagem?: string;
}
