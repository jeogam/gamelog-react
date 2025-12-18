'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { perfilService } from '@/services/perfilService';
import { Perfil } from '@/interfaces/Perfil';
import Link from 'next/link';

// Ícone de Lápis
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
);

export default function PerfilPage() {
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        perfilService.getMeuPerfil()
            .then(setPerfil)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10">
                <main className="container mx-auto px-4 py-10">
                    
                    {/* Card de Perfil Limpo (Sem Banner) */}
                    <div className="max-w-3xl mx-auto bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
                        
                        <div className="p-8">
                            {/* Cabeçalho do Perfil: Avatar + Nome + Botão */}
                            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                                
                                {/* Avatar */}
                                <div className="w-28 h-28 rounded-full border-4 border-[#0D1117] bg-[#21262D] shadow-lg shrink-0 overflow-hidden">
                                    <img 
                                        src={perfil?.avatarImagem || "https://via.placeholder.com/150"} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                                    />
                                </div>

                                {/* Informações e Ações */}
                                <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-between w-full gap-4">
                                    
                                    <div className="text-center md:text-left">
                                        <h1 className="text-3xl font-bold text-white mb-1">
                                            {loading ? 'Carregando...' : (perfil?.nomeExibicao || 'Gamer Desconhecido')}
                                        </h1>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="text-[#8B949E] text-sm">Membro do GameLog</span>
                                            {/* Badge opcional se quiser manter visualmente */}
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E839C2]/10 text-[#E839C2] border border-[#E839C2]/20">
                                                PLAYER
                                            </span>
                                        </div>
                                    </div>

                                    <Link 
                                        href="/perfil/editar" 
                                        className="btn inline-flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <IconEdit /> Editar Perfil
                                    </Link>
                                </div>
                            </div>

                            {/* Divisor */}
                            <hr className="border-[#30363d] mb-6" />

                            {/* Conteúdo da Bio */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold uppercase text-[#8B949E] mb-3 tracking-wider">Sobre</h3>
                                <div className="bg-[#0D1117] p-5 rounded-lg border border-[#30363d]">
                                    <p className="text-[#F0F6FC] whitespace-pre-wrap leading-relaxed text-sm">
                                        {perfil?.biografia || "Este usuário ainda não escreveu uma biografia. Clique em editar para adicionar uma!"}
                                    </p>
                                </div>
                            </div>

                            {/* Estatísticas (Placeholder) */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 rounded bg-[#0D1117] border border-[#30363d] hover:border-[#E839C2]/50 transition-colors cursor-default">
                                    <span className="block text-2xl font-bold text-white">0</span>
                                    <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-widest">Jogos</span>
                                </div>
                                <div className="text-center p-4 rounded bg-[#0D1117] border border-[#30363d] hover:border-[#E839C2]/50 transition-colors cursor-default">
                                    <span className="block text-2xl font-bold text-white">0</span>
                                    <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-widest">Reviews</span>
                                </div>
                                <div className="text-center p-4 rounded bg-[#0D1117] border border-[#30363d] hover:border-[#E839C2]/50 transition-colors cursor-default">
                                    <span className="block text-2xl font-bold text-white">0</span>
                                    <span className="text-[10px] text-[#8B949E] uppercase font-bold tracking-widest">Listas</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}