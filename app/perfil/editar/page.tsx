// app/perfil/editar/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { perfilService } from '@/services/perfilService';
import { Perfil } from '@/interfaces/Perfil';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Ícones
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconImage = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>);
const IconText = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>);
const IconSave = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>);
const IconBack = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>);

export default function EditarPerfilPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [nomeExibicao, setNomeExibicao] = useState('');
    const [biografia, setBiografia] = useState('');
    const [avatarImagem, setAvatarImagem] = useState('');

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setLoading(true);
            const dados = await perfilService.getMeuPerfil();
            setNomeExibicao(dados.nomeExibicao || '');
            setBiografia(dados.biografia || '');
            setAvatarImagem(dados.avatarImagem || '');
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await perfilService.updateMeuPerfil({ nomeExibicao, biografia, avatarImagem });
            // Redireciona de volta para a visualização ao salvar
            router.push('/perfil');
        } catch (err) {
            setError('Erro ao salvar.');
            setSaving(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10">
                <main className="container mx-auto px-4 py-6">
                    
                    {/* Botão Cancelar/Voltar */}
                    <div className="max-w-xl mx-auto mb-3">
                        <Link href="/perfil" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-wide font-bold">
                            <IconBack />
                            <span className="ml-1">Cancelar e Voltar</span>
                        </Link>
                    </div>

                    {/* Formulário */}
                    <div className="max-w-xl mx-auto bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-xl">
                        <div className="mb-6 border-b border-[#30363d] pb-4">
                            <h1 className="text-xl font-bold text-white">Editar Perfil</h1>
                            <p className="text-[#8B949E] text-sm">Atualize suas informações públicas.</p>
                        </div>

                        {error && <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-200 text-sm">{error}</div>}

                        <form onSubmit={handleSalvar} className="space-y-4">
                            
                            {/* Preview do Avatar em tempo real */}
                            <div className="flex justify-center mb-6">
                                <img 
                                    src={avatarImagem || "https://via.placeholder.com/150"} 
                                    alt="Preview" 
                                    className="w-24 h-24 rounded-full object-cover border-2 border-[#E839C2] bg-[#0D1117]"
                                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-[#8B949E] mb-1">Nome de Exibição</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconUser /></div>
                                    <input
                                        type="text"
                                        value={nomeExibicao}
                                        onChange={(e) => setNomeExibicao(e.target.value)}
                                        className="w-full bg-[#0D1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-[#E839C2] focus:border-[#E839C2] block pl-10 p-2.5"
                                        placeholder="Seu Nickname"
                                        maxLength={50}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-[#8B949E] mb-1">URL do Avatar</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconImage /></div>
                                    <input
                                        type="text"
                                        value={avatarImagem}
                                        onChange={(e) => setAvatarImagem(e.target.value)}
                                        className="w-full bg-[#0D1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-[#E839C2] focus:border-[#E839C2] block pl-10 p-2.5"
                                        placeholder="https://exemplo.com/imagem.png"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-[#8B949E] mb-1">Biografia</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none"><IconText /></div>
                                    <textarea
                                        value={biografia}
                                        onChange={(e) => setBiografia(e.target.value)}
                                        className="w-full bg-[#0D1117] border border-[#30363d] text-white text-sm rounded-lg focus:ring-[#E839C2] focus:border-[#E839C2] block pl-10 p-2.5 min-h-[100px]"
                                        placeholder="Conte um pouco sobre seus jogos favoritos..."
                                        maxLength={500}
                                    />
                                </div>
                                <div className="text-right text-xs text-[#8B949E] mt-1">{biografia.length}/500</div>
                            </div>

                            <div className="pt-4 border-t border-[#30363d] flex justify-end gap-3">
                                <Link href="/perfil" className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-[#30363d] rounded-lg hover:bg-[#30363d] transition-colors">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={saving || loading}
                                    className="btn px-6 py-2 text-sm" // Usa sua classe .btn rosa do globals.css
                                >
                                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}