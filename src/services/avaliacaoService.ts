// src/services/avaliacaoService.ts
import api from "./api";
import type { PageResponse } from "@/interfaces/PageResponse";
import { pageableParams, type PageableQuery } from "@/services/pageable";

export type CriarAvaliacaoDTO = {
  nota: number; // 1..5
  comentario: string; // até 500
  usuarioId: string; // UUID
  jogoId: string; // UUID
};

export type AtualizarAvaliacaoDTO = {
  id: string; // UUID da avaliação
  nota: number; // 1..5
  comentario: string; // até 500
};

export type AvaliacaoResponseDTO = {
  id: string;
  nota: number;
  comentario: string;
  usuarioId: string;
  jogoId: string;
  createdAt?: string;
};

// ✅ (mantém) POST /avaliacoes/avaliacao
export async function criarAvaliacao(payload: CriarAvaliacaoDTO) {
  const { data } = await api.post<AvaliacaoResponseDTO>(
    "/avaliacoes/avaliacao",
    payload
  );
  return data;
}

// ✅ (mantém) GET /avaliacoes/jogo/{jogoId} (List)
export async function listarAvaliacoesDoJogo(jogoId: string) {
  if (!jogoId) throw new Error("jogoId inválido");
  const { data } = await api.get<AvaliacaoResponseDTO[]>(`/avaliacoes/jogo/${jogoId}`);
  return data;
}

// ✅ (adicionado) GET /avaliacoes/paginado (Page)
export async function listarAvaliacoesPaginado(q?: PageableQuery) {
  const { data } = await api.get<PageResponse<AvaliacaoResponseDTO>>(
    "/avaliacoes/paginado",
    {
      params: pageableParams({
        ...q,
        sort: q?.sort ?? "createdAt,desc",
      }),
    }
  );
  return data;
}

// ✅ (mantém) GET /avaliacoes/avaliacao/{id}
export async function buscarAvaliacaoPorId(id: string) {
  const { data } = await api.get<AvaliacaoResponseDTO>(`/avaliacoes/avaliacao/${id}`);
  return data;
}

// ✅ (mantém) PUT /avaliacoes/avaliacao/{id} (backend exige dto.id == path)
export async function atualizarAvaliacao(
  id: string,
  payload: Omit<AtualizarAvaliacaoDTO, "id">
) {
  const body: AtualizarAvaliacaoDTO = { id, ...payload };
  const { data } = await api.put<AvaliacaoResponseDTO>(
    `/avaliacoes/avaliacao/${id}`,
    body
  );
  return data;
}

// ✅ (mantém) DELETE /avaliacoes/avaliacao/{id}
export async function removerAvaliacao(id: string) {
  const { data } = await api.delete<{ id: string }>(`/avaliacoes/avaliacao/${id}`);
  return data;
}
