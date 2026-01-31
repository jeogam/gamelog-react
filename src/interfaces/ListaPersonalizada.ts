import { Game } from "./Game";

export interface ListaPersonalizada {
  id: string;
  nome: string;
  publica: boolean;
  usuarioId: string;
  jogos: Game[];
}

export interface ListaPersonalizadaCriarDTO {
  nome: string;
  publica: boolean;
  usuarioId: string;
  jogosIds?: string[];
}