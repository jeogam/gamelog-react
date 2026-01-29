// src/services/bibliotecaService.ts
import api from "./api";
import type { PageResponse } from "@/interfaces/PageResponse";
import { pageableParams, type PageableQuery } from "@/services/pageable";

export type StatusJogo =
  | "QUERO_JOGAR"
  | "JOGANDO"
  | "FINALIZADO"
  | "DESISTIDO";

export interface BibliotecaCriarDTO {
  usuarioId: string;
  jogoId: string;
  status: StatusJogo;
  favorito: boolean;
}

export interface BibliotecaAtualizarDTO {
  id: string;
  status: StatusJogo;
  favorito: boolean;
}

export interface BibliotecaResponseDTO {
  id: string;
  status: StatusJogo;
  favorito: boolean;

  jogoId?: string;
  jogo?: {
    id: string;
    titulo?: string;
    capaUrl?: string;
  };

  tituloJogo?: string;
  capaUrl?: string;
  usuarioId?: string;
}

/**
 * ✅ named export (IGUAL gameService)
 */
export const bibliotecaService = {
  async adicionarJogo(dados: BibliotecaCriarDTO): Promise<BibliotecaResponseDTO> {
    const { data } = await api.post("/bibliotecas/item", dados);
    return data;
  },

  async getBibliotecaDoUsuario(
    usuarioId: string
  ): Promise<BibliotecaResponseDTO[]> {
    const { data } = await api.get(
      `/bibliotecas/usuario/${usuarioId}`
    );
    return data;
  },

  async getPaginado(q?: PageableQuery): Promise<PageResponse<BibliotecaResponseDTO>> {
    const { data } = await api.get("/bibliotecas/paginado", {
      params: pageableParams({
        ...q,
        sort: q?.sort ?? "jogo.titulo,asc",
      }),
    });
    return data;
  },

  async getItemById(id: string): Promise<BibliotecaResponseDTO> {
    const { data } = await api.get(`/bibliotecas/item/${id}`);
    return data;
  },

  async getItemDoUsuarioPorJogo(
    usuarioId: string,
    jogoId: string
  ): Promise<BibliotecaResponseDTO | null> {
    const lista = await this.getBibliotecaDoUsuario(usuarioId);

    return (
      lista.find(
        (it) => String(it.jogo?.id ?? it.jogoId) === String(jogoId)
      ) ?? null
    );
  },

  async atualizarItem(
    id: string,
    dados: Omit<BibliotecaAtualizarDTO, "id">
  ): Promise<BibliotecaResponseDTO> {
    const payload: BibliotecaAtualizarDTO = { id, ...dados };
    const { data } = await api.put(`/bibliotecas/item/${id}`, payload);
    return data;
  },

  async atualizarStatus(
    itemId: string,
    status: StatusJogo,
    favoritoAtual: boolean
  ): Promise<BibliotecaResponseDTO> {
    return this.atualizarItem(itemId, {
      status,
      favorito: favoritoAtual,
    });
  },

  async removerItem(id: string): Promise<{ id: string }> {
    const { data } = await api.delete(`/bibliotecas/item/${id}`);
    return data;
  },
};
