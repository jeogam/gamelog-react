import api from "./api";
import type { PerfilStats } from "@/interfaces/PerfilStats";

type AvaliacaoMin = { usuarioId?: string; usuario?: { id?: string } };

async function countBiblioteca(usuarioId: string): Promise<number> {
  const res = await api.get(`/bibliotecas/usuario/${usuarioId}`);
  const data = res.data;
  return Array.isArray(data) ? data.length : (data?.content?.length ?? 0);
}

async function countListas(usuarioId: string): Promise<number> {
  const res = await api.get(`/listas/usuario/${usuarioId}`);
  const data = res.data;
  return Array.isArray(data) ? data.length : (data?.content?.length ?? 0);
}

async function countAvaliacoes(usuarioId: string): Promise<number> {
  // tentativa 1: query param
  try {
    const res = await api.get(`/avaliacoes`, { params: { usuarioId } });
    const data = res.data;
    if (Array.isArray(data)) return data.length;
    if (Array.isArray(data?.content)) return data.content.length;
  } catch {
    // fallback abaixo
  }

  // fallback: traz tudo e filtra
  const resAll = await api.get(`/avaliacoes`);
  const dataAll = resAll.data;

  const arr: AvaliacaoMin[] = Array.isArray(dataAll)
    ? dataAll
    : Array.isArray(dataAll?.content)
      ? dataAll.content
      : [];

  return arr.filter((a) => {
    const id1 = a.usuarioId ? String(a.usuarioId) : null;
    const id2 = a.usuario?.id ? String(a.usuario.id) : null;
    return id1 === String(usuarioId) || id2 === String(usuarioId);
  }).length;
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
