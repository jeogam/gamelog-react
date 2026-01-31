"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Trash2, Plus, Search, X } from "lucide-react";
import Image from "next/image";

// Services e Componentes
import { listaService } from "@/services/listaService";
import {
  bibliotecaService,
  BibliotecaResponseDTO,
} from "@/services/bibliotecaService";
import { perfilService } from "@/services/perfilService";
import { ListaPersonalizada } from "@/interfaces/ListaPersonalizada";
import GameCard from "@/components/GameCard";
import GameCardSkeleton from "@/components/GameCardSkeleton";

export default function ListaDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();

  // Estados principais
  const [lista, setLista] = useState<ListaPersonalizada | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<string | null>(null);

  // Estados do Modal de Adicionar Jogo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [biblioteca, setBiblioteca] = useState<BibliotecaResponseDTO[]>([]);
  const [loadingBiblio, setLoadingBiblio] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // 1. Carrega Lista e Usuário Logado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Busca Lista
        const listaDados = await listaService.getById(id as string);
        setLista(listaDados);

        // Busca Usuário Logado (para saber se sou o dono)
        const perfil = await perfilService.getMeuPerfil().catch(() => null);
        if (perfil) setUsuarioLogadoId(String(perfil.usuarioId));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Carrega Biblioteca (apenas se abrir o modal)
  const abrirModalAdicionar = async () => {
    setIsModalOpen(true);
    if (biblioteca.length > 0) return; // Já carregou

    if (!usuarioLogadoId) return;

    setLoadingBiblio(true);
    try {
      const dados =
        await bibliotecaService.getBibliotecaDoUsuario(usuarioLogadoId);
      setBiblioteca(dados);
    } catch (error) {
      console.error("Erro ao carregar biblioteca", error);
    } finally {
      setLoadingBiblio(false);
    }
  };

  // 3. Adicionar Jogo à Lista
  const handleAdicionarJogo = async (jogoId: string) => {
    if (!lista) return;

    // Cria array com IDs atuais + novo ID
    const atuaisIds = lista.jogos.map((j) => String(j.id));
    const novosIds = [...atuaisIds, String(jogoId)];

    try {
      // Atualiza no Backend
      const listaAtualizada = await listaService.atualizar({
        id: lista.id,
        nome: lista.nome,
        publica: lista.publica,
        jogosIds: novosIds,
      });

      // Atualiza Frontend
      setLista(listaAtualizada);
      setIsModalOpen(false); // Fecha modal
    } catch (error) {
      alert("Erro ao atualizar lista.");
    }
  };

  // 4. Remover Jogo da Lista
  const handleRemoverJogo = async (jogoIdParaRemover: string) => {
    if (!lista || !confirm("Remover este jogo da lista?")) return;

    const novosIds = lista.jogos
      .map((j) => String(j.id))
      .filter((id) => id !== String(jogoIdParaRemover));

    try {
      const listaAtualizada = await listaService.atualizar({
        id: lista.id,
        nome: lista.nome,
        publica: lista.publica,
        jogosIds: novosIds,
      });
      setLista(listaAtualizada);
    } catch (error) {
      alert("Erro ao remover jogo.");
    }
  };

  const handleDeleteLista = async () => {
    if (!confirm("Tem certeza que deseja excluir esta lista permanentemente?"))
      return;
    try {
      await listaService.deletar(id as string);
      router.push("/perfil");
    } catch (error) {
      alert("Erro ao deletar lista");
    }
  };

  // Filtros para o Modal
  const jogosParaAdicionar = useMemo(() => {
    if (!lista) return [];

    // Pega IDs dos jogos que já estão na lista
    const idsNaLista = new Set(lista.jogos.map((j) => String(j.id)));

    return biblioteca.filter((item) => {
      // Filtra jogos que já estão na lista
      const jogoId = String(item.jogo?.id || item.jogoId);
      if (idsNaLista.has(jogoId)) return false;

      // Filtra por busca (nome)
      const titulo = item.tituloJogo || item.jogo?.titulo || "";
      return titulo.toLowerCase().includes(termoBusca.toLowerCase());
    });
  }, [biblioteca, lista, termoBusca]);

  const isDono =
    usuarioLogadoId &&
    lista &&
    String(usuarioLogadoId) === String(lista.usuarioId);

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!lista)
    return (
      <div className="p-8 text-white text-center">Lista não encontrada.</div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          <h1 className="text-3xl font-black text-white">{lista.nome}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${lista.publica ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-400"}`}
            >
              {lista.publica ? "PÚBLICA" : "PRIVADA"}
            </span>
            <span className="text-zinc-500 text-sm">
              {lista.jogos.length} jogos
            </span>
          </div>
        </div>

        {isDono && (
          <div className="flex gap-3">
            <button
              onClick={abrirModalAdicionar}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} /> Adicionar Jogo
            </button>
            <button
              onClick={handleDeleteLista}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Excluir Lista"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Grid de Jogos da Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {lista.jogos.map((jogo) => (
          <div key={jogo.id} className="relative group">
            <GameCard
              game={{
                id: String(jogo.id),
                name: jogo.titulo, 
                background_image: jogo.capaUrl, 
                released: jogo.anoLancamento
                  ? String(jogo.anoLancamento)
                  : undefined,
              }}
              onViewDetails={() => router.push(`/jogo/${jogo.id}`)}
              isLoading={false}
            />
            {isDono && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoverJogo(String(jogo.id));
                }}
                className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                title="Remover da lista"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        {lista.jogos.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-zinc-900/20">
            <p className="text-zinc-500 text-lg">Esta lista está vazia.</p>
            {isDono && (
              <button
                onClick={abrirModalAdicionar}
                className="mt-4 text-indigo-400 hover:underline"
              >
                Adicionar jogos da biblioteca
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL DE ADICIONAR JOGO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-2xl flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Adicionar da Biblioteca
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-4 border-b border-white/5 bg-zinc-900/50">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar nos seus jogos..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Content (Lista de Jogos) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {loadingBiblio ? (
                <div className="text-center py-10 text-zinc-500">
                  Carregando sua biblioteca...
                </div>
              ) : jogosParaAdicionar.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  {termoBusca
                    ? "Nenhum jogo encontrado com esse nome."
                    : "Todos os seus jogos já estão nesta lista!"}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jogosParaAdicionar.map((item) => {
                    const jId = item.jogo?.id || item.jogoId;
                    const jTitulo = item.tituloJogo || item.jogo?.titulo;
                    const jCapa = item.capaUrl || item.jogo?.capaUrl;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleAdicionarJogo(String(jId))}
                        className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-zinc-950/50 hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all group text-left"
                      >
                        <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-zinc-800">
                          {jCapa && (
                            <Image
                              src={jCapa}
                              alt={jTitulo || ""}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-zinc-200 truncate group-hover:text-white">
                            {jTitulo}
                          </p>
                          <p className="text-xs text-zinc-500">{item.status}</p>
                        </div>
                        <Plus
                          size={18}
                          className="text-zinc-600 group-hover:text-indigo-400"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
