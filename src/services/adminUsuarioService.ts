import api from "./api";
import type { PapelUsuario, UsuarioAdmin } from "@/interfaces/UsuarioAdmin";

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // pageNumber
  size: number;
};

export const adminUsuarioService = {
  // GET /usuarios/paginado
  async listarPaginado(params: { page: number; size: number; sort?: string }) {
    const res = await api.get<PageResponse<UsuarioAdmin>>("/usuarios/paginado", { params });
    return res.data;
  },

  // PUT /admin/usuarios/{id}/papel
  async atualizarPapel(id: string, papel: PapelUsuario) {
    // DTO: UsuarioPapelRequestDTO (provavelmente { papel: "ADMINISTRADOR" })
    const res = await api.put<UsuarioAdmin>(`/admin/usuarios/${id}/papel`, { papel });
    return res.data;
  },

  // DELETE /usuarios/usuario/{id}
  async excluirUsuario(id: string) {
    await api.delete(`/usuarios/usuario/${id}`);
  },
};
