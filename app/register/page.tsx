'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await authService.register(formData);
      alert("Conta criada com sucesso! Redirecionando para o login...");
      router.push('/login');
    } catch (error: any) {
      setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0D1117] text-white overflow-hidden">
      
      {/* LADO ESQUERDO */}
      <div className="relative hidden w-1/2 items-center justify-center bg-[#0D1117] lg:flex">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-[#E839C2] opacity-20 blur-[120px]" />
        
        <div className="relative z-10 transform rotate-[15deg] hover:rotate-[10deg] transition-transform duration-700 ease-in-out">
           <img 
            src="/images/controller-bg.png" 
            alt="Controle Gamer" 
            className="w-[400px] pixelated drop-shadow-2xl object-contain grayscale-[30%] hover:grayscale-0 transition-all select-none"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
           <h1 className="text-8xl font-black text-[#21262D] opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
            JOIN
          </h1>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="flex w-full items-center justify-center bg-[#0D1117] px-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-[#30363d] bg-[#161b22] p-10 shadow-xl">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Crie sua conta</h2>
            <p className="mt-2 text-sm text-gray-400">Junte-se ao squad e organize sua coleção</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {erro}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nome de Usuário</label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#30363d] bg-[#0D1117] p-3 text-white outline-none focus:border-[#E839C2] focus:ring-1 focus:ring-[#E839C2] transition-all"
                placeholder="Ex: MasterChief"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-[#30363d] bg-[#0D1117] p-3 text-white outline-none focus:border-[#E839C2] focus:ring-1 focus:ring-[#E839C2] transition-all"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Senha</label>
              <input
                type="password"
                className="w-full rounded-lg border border-[#30363d] bg-[#0D1117] p-3 text-white outline-none focus:border-[#E839C2] focus:ring-1 focus:ring-[#E839C2] transition-all"
                placeholder="Crie uma senha forte"
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-4 rounded-lg bg-[#E839C2] py-3 font-bold text-white shadow-lg shadow-[#E839C2]/20 hover:bg-[#d634b2] hover:shadow-[#E839C2]/40 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'CRIANDO...' : 'CADASTRAR GRÁTIS'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Já tem login?{' '}
            {/* AQUI ESTÁ A MUDANÇA */}
            <Link href="/login" className="link-neon">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}