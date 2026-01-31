"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { authService } from "@/services/authService";
import { adminUsuarioService } from "@/services/adminUsuarioService";
import type { PapelUsuario, UsuarioAdmin } from "@/interfaces/UsuarioAdmin";

// ✅ Componente Avatar local (igual ao usado nas avaliações)
function Avatar({ src, alt, size = 40 }: { src?: string; alt: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  const s = `${size}px`;

  if (!src || broken) {
    return (
      <div
        style={{ width: s, height: s, minWidth: s }}
        className="grid place-items-center rounded-full border border-white/10 bg-zinc-800 text-xs font-bold text-zinc-300"
        title={alt}
      >
        {alt?.trim()?.slice(0, 1)?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{ width: s, height: s, minWidth: s }}
      className="rounded-full border border-white/10 object-cover"
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

const ROLES: PapelUsuario[] = ["ADMINISTRADOR", "MODERADOR", "USUARIO"];

type RowState = {
  roleDraft: PapelUsuario;
  saving: boolean;
  deleting: boolean;
};

export default function AdminPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [items, setItems] = useState<UsuarioAdmin[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [rows, setRows] = useState<Record<string, RowState>>({});

  const handleLogout = () => authService.logout();

  async function load() {
    setLoading(true);
    setErro(null);
    try {
      const data = await adminUsuarioService.listarPaginado({
        page,
        size,
        sort: "nome,asc",
      });

      setItems(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

      const nextRows: Record<string, RowState> = {};
      for (const u of data.content) {
        nextRows[u.id] = {
          roleDraft: u.papel,
          saving: false,
          deleting: false,
        };
      }
      setRows(nextRows);
    } catch (e: any) {
      setErro(e?.response?.data?.message || "Não foi possível carregar usuários.");
      setItems([]);
      setTotalPages(0);
      setTotalElements(0);
      setRows({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const headerSubtitle = useMemo(() => {
    if (loading) return "Carregando…";
    if (erro) return "Falha ao carregar";
    return `${totalElements} usuário(s)`;
  }, [loading, erro, totalElements]);

  function setRoleDraft(id: string, papel: PapelUsuario) {
    setRows((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { roleDraft: papel, saving: false, deleting: false }), roleDraft: papel },
    }));
  }

  async function salvarPapel(u: UsuarioAdmin) {
    const row = rows[u.id];
    if (!row) return;

    const novoPapel = row.roleDraft;
    if (novoPapel === u.papel) return;

    setRows((prev) => ({ ...prev, [u.id]: { ...prev[u.id], saving: true } }));
    setErro(null);

    try {
      const updated = await adminUsuarioService.atualizarPapel(u.id, novoPapel);
      setItems((prev) => prev.map((x) => (x.id === u.id ? { ...x, papel: updated.papel } : x)));
      setRows((prev) => ({ ...prev, [u.id]: { ...prev[u.id], roleDraft: updated.papel, saving: false } }));
    } catch (e: any) {
      setErro(e?.response?.data?.message || "Não foi possível atualizar o papel.");
      setRows((prev) => ({ ...prev, [u.id]: { ...prev[u.id], saving: false, roleDraft: u.papel } }));
    }
  }

  async function excluirUsuario(u: UsuarioAdmin) {
    const ok = window.confirm(`Excluir o usuário "${u.nome}"? Essa ação não pode ser desfeita.`);
    if (!ok) return;

    setRows((prev) => ({ ...prev, [u.id]: { ...prev[u.id], deleting: true } }));
    setErro(null);

    try {
      await adminUsuarioService.excluirUsuario(u.id);
      setItems((prev) => prev.filter((x) => x.id !== u.id));
      setTimeout(() => {
        load();
      }, 0);
    } catch (e: any) {
      setErro(e?.response?.data?.message || "Não foi possível excluir o usuário.");
      setRows((prev) => ({ ...prev, [u.id]: { ...prev[u.id], deleting: false } }));
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Painel de Administração</h1>
              <p className="mt-1 text-sm text-zinc-400">{headerSubtitle}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-zinc-900"
            >
              Sair
            </button>
          </div>

          {erro ? (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {erro}
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-semibold text-zinc-100">Usuários</div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!canPrev || loading}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-xs text-zinc-400">
                  Página <span className="text-zinc-200">{page + 1}</span> /{" "}
                  <span className="text-zinc-200">{Math.max(totalPages, 1)}</span>
                </span>
                <button
                  disabled={!canNext || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-zinc-950/40">
                  <tr className="text-left text-xs font-bold uppercase tracking-widest text-zinc-400">
                    <th className="px-4 py-3">Usuário</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Papel</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-sm text-zinc-400">
                        Carregando usuários…
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-sm text-zinc-400">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    items.map((u) => {
                      const row = rows[u.id];
                      const roleDraft = row?.roleDraft ?? u.papel;
                      const saving = row?.saving ?? false;
                      const deleting = row?.deleting ?? false;
                      const changed = roleDraft !== u.papel;

                      return (
                        <tr key={u.id} className="text-sm text-zinc-200">
                          <td className="px-4 py-3">
                            {/* ✅ Adicionado Avatar ao lado do nome */}
                            <div className="flex items-center gap-3">
                                <Avatar src={u.avatarImagem} alt={u.nome} size={40} />
                                <div>
                                    <div className="font-semibold text-zinc-100">{u.nome}</div>
                                    <div className="mt-0.5 text-xs text-zinc-500">ID: {u.id}</div>
                                </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-zinc-300">{u.email}</td>

                          <td className="px-4 py-3">
                            <select
                              value={roleDraft}
                              disabled={saving || deleting}
                              onChange={(e) => setRoleDraft(u.id, e.target.value as PapelUsuario)}
                              className="w-full max-w-[220px] rounded-xl border border-white/10 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-indigo-500/60"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                disabled={!changed || saving || deleting}
                                onClick={() => salvarPapel(u)}
                                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40"
                              >
                                {saving ? "Salvando…" : "Salvar"}
                              </button>

                              <button
                                disabled={saving || deleting}
                                onClick={() => excluirUsuario(u)}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-40"
                              >
                                {deleting ? "Excluindo…" : "Excluir"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
             <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-zinc-500">
              <span>
                Mostrando <span className="text-zinc-200">{items.length}</span> item(ns) nesta página
              </span>
              <button
                onClick={load}
                disabled={loading}
                className="rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
              >
                Recarregar
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}