import api from "./api";
import type { PerfilStats } from "@/interfaces/PerfilStats";

async function countBiblioteca(usuarioId: string): Promise<number> {
  try {
    const res = await api.get(`/bibliotecas/usuario/${usuarioId}`);
    const data = res.data;
    // Suporta paginação (content) ou lista direta (array)
    return Array.isArray(data) ? data.length : (data?.content?.length ?? 0);
  } catch {
    return 0;
  }
}

async function countListas(usuarioId: string): Promise<number> {
  try {
    const res = await api.get(`/listas/usuario/${usuarioId}`);
    const data = res.data;
    return Array.isArray(data) ? data.length : (data?.content?.length ?? 0);
  } catch {
    return 0;
  }
}

async function countAvaliacoes(usuarioId: string): Promise<number> {
  try {
    // ✅ USA O NOVO ENDPOINT OTIMIZADO
    // O backend já filtra, então o tamanho do array é a quantidade exata.
    const res = await api.get(`/avaliacoes/usuario/${usuarioId}`);
    return res.data.length;
  } catch (error) {
    console.warn("Erro ao contar avaliações:", error);
    return 0;
  }
}

export const perfilStatsService = {
  async getStatsByUsuarioId(usuarioId: string): Promise<PerfilStats> {
    const [jogos, listas, reviews] = await Promise.all([
      countBiblioteca(usuarioId),
      countListas(usuarioId),
      countAvaliacoes(usuarioId),
    ]);

    return { jogos, reviews, listas };
  },
};