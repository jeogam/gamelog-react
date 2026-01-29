// src/services/gameService.ts
import api from "./api";
import { Game } from "@/interfaces/Game";
import type { PageResponse } from "@/interfaces/PageResponse";
import { pageableParams, type PageableQuery } from "@/services/pageable";

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

// ✅ (mantém) Busca externa RAWG
export async function searchGames(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await api.get(`/jogos/pesquisar-externo`, {
      params: { nome: query },
    });
    return response.data;
  } catch (error) {
    console.error("Erro no searchGames:", error);
    return [];
  }
}

// ✅ (mantém) Importar jogo (POST /jogos/jogo)
export async function importGame(gameData: SearchResult): Promise<Game> {
  const payload: GameImportDTO = {
    idExterno: gameData.id,
    titulo: gameData.name,
    capaUrl: gameData.background_image || "",
    anoLancamento: gameData.released
      ? parseInt(gameData.released.substring(0, 4))
      : undefined,
    descricao: `Importado da RAWG: ${gameData.name}`,
    genero: "Importado",
    plataformas: "Multiplataforma",
  };

  try {
    const response = await api.post("/jogos/jogo", payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 422) {
      throw new Error("Este jogo já foi adicionado ao catálogo global.");
    }
    throw new Error(error.response?.data?.message || "Falha ao importar o jogo.");
  }
}

// ✅ (mantém) Detalhes do jogo
export async function fetchGameDetails(gameId: string): Promise<Game> {
  if (!gameId) throw new Error("ID do jogo inválido");
  const response = await api.get(`/jogos/jogo/${gameId}`);
  return response.data;
}

// ✅ (mantém) Listar jogos (não paginado) — se ainda existir no backend
export async function getJogosSalvos(): Promise<Game[]> {
  const response = await api.get("/jogos");
  return response.data;
}

// ✅ (adicionado) Listar jogos PAGINADO (novo padrão)
export async function getJogosPaginado(q?: PageableQuery): Promise<PageResponse<Game>> {
  const { data } = await api.get<PageResponse<Game>>("/jogos/paginado", {
    params: pageableParams({
      ...q,
      sort: q?.sort ?? "titulo,asc", // padrão sugerido
    }),
  });
  return data;
}
