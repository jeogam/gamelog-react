"use client";

import { useEffect, useState } from "react";
import { Plus, List as ListIcon, Lock, Globe, Heart } from "lucide-react"; 
import Link from "next/link";
import { listaService } from "@/services/listaService";
import { bibliotecaService } from "@/services/bibliotecaService"; 
import { ListaPersonalizada } from "@/interfaces/ListaPersonalizada";

interface Props {
  usuarioId: string;
  isMeuPerfil: boolean;
}

export default function MinhasListasTab({ usuarioId, isMeuPerfil }: Props) {
  const [listas, setListas] = useState<ListaPersonalizada[]>([]);
  const [favoritosCount, setFavoritosCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const listasData = await listaService.getByUsuario(usuarioId);
      const exibiveis = isMeuPerfil ? listasData : listasData.filter(l => l.publica);
      setListas(exibiveis);

      const bibliotecaData = await bibliotecaService.getBibliotecaDoUsuario(usuarioId);
      const favs = bibliotecaData.filter(item => item.favorito).length;
      setFavoritosCount(favs);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarDados(); }, [usuarioId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await listaService.criar({ nome, publica: isPublic, usuarioId });
      setIsModalOpen(false);
      setNome("");
      carregarDados();
    } catch (err) { alert("Erro ao criar lista."); }
  };

  if (loading) return <div className="py-10 text-center text-zinc-500">Carregando coleções...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
          Coleções ({listas.length + 1})
        </h3>
        {isMeuPerfil && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400 transition-colors hover:bg-indigo-500 hover:text-white"
          >
            <Plus size={14} /> NOVA LISTA
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        {/* --- CARD FIXO DE FAVORITOS (AGORA PÚBLICO) --- */}
        <Link 
          href={`/perfil/favoritos?uid=${usuarioId}`} 
          className="group relative flex flex-col justify-between rounded-xl border border-pink-500/30 bg-pink-500/5 p-5 transition-all hover:border-pink-500 hover:bg-pink-500/10"
        >
          <div>
            <div className="mb-3 flex items-start justify-between">
              <div className="rounded-lg bg-pink-500/20 p-2 text-pink-500 transition-colors group-hover:bg-pink-500 group-hover:text-white">
                <Heart size={20} fill="currentColor" />
              </div>
              {/* ✅ MUDANÇA AQUI: Agora usa Globe em vez de Lock */}
              <Globe size={16} className="text-pink-500/50 group-hover:text-pink-400" />
            </div>
            <h4 className="font-bold text-pink-100 group-hover:text-pink-300">Jogos Favoritos</h4>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-pink-500/20 pt-3">
            <span className="text-xs font-medium text-pink-300/70">{favoritosCount} jogos</span>
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider group-hover:text-pink-200">Ver coleção &rarr;</span>
          </div>
        </Link>

        {/* --- LISTAS PERSONALIZADAS --- */}
        {listas.map((lista) => (
          <Link 
            key={lista.id} 
            href={`/perfil/listas/${lista.id}`}
            className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/40 p-5 transition-all hover:border-indigo-500/50 hover:bg-zinc-900/60"
          >
            <div>
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                  <ListIcon size={20} />
                </div>
                {lista.publica 
                  ? <Globe size={16} className="text-zinc-600 group-hover:text-zinc-400" /> 
                  : <Lock size={16} className="text-zinc-600 group-hover:text-zinc-400" />
                }
              </div>
              <h4 className="font-bold text-zinc-100 group-hover:text-indigo-300">{lista.nome}</h4>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <span className="text-xs font-medium text-zinc-500">{lista.jogos?.length || 0} jogos</span>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider group-hover:text-indigo-400">Ver detalhes &rarr;</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Nova Coleção</h3>
            <div>
              <label className="mb-1 block text-xs text-zinc-400">Nome da Lista</label>
              <input 
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Ex: RPGs Favoritos"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-zinc-950 p-3">
              <input 
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-zinc-300">Tornar lista pública</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-lg bg-zinc-800 py-2 text-sm font-medium text-white hover:bg-zinc-700">Cancelar</button>
              <button type="submit" className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500">Criar Lista</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}