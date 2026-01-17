'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await authService.login({ email, senha });
      if (response && response.token) {
        window.location.href = '/'; 
      } else {
        setErro('Credenciais inválidas.');
      }
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setErro('Email ou senha incorretos.');
      } else {
        setErro('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0D1117] text-white overflow-hidden">
      
      {/* LADO ESQUERDO */}
      <div className="relative hidden w-1/2 items-center justify-center bg-[#0D1117] lg:flex">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-[#E839C2] opacity-20 blur-[120px]" />
        
        <div className="relative z-10 transform rotate-[-15deg] hover:rotate-[-10deg] transition-transform duration-700 ease-in-out">
          <img 
            src="/images/controller-bg.png" 
            alt="Controle Gamer" 
            className="w-[400px] pixelated drop-shadow-2xl object-contain select-none"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="text-8xl font-black text-[#21262D] opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
            PLAY
          </h1>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="flex w-full items-center justify-center bg-[#0D1117] px-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-[#30363d] bg-[#161b22] p-10 shadow-xl">
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="mt-2 text-sm text-gray-400">Faça login para acessar sua biblioteca</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {erro && (
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {erro}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-[#30363d] bg-[#0D1117] p-3 text-white outline-none focus:border-[#E839C2] focus:ring-1 focus:ring-[#E839C2] transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Senha</label>
              <input
                type="password"
                className="w-full rounded-lg border border-[#30363d] bg-[#0D1117] p-3 text-white outline-none focus:border-[#E839C2] focus:ring-1 focus:ring-[#E839C2] transition-all"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full rounded-lg bg-[#E839C2] py-3 font-bold text-white shadow-lg shadow-[#E839C2]/20 hover:bg-[#d634b2] hover:shadow-[#E839C2]/40 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'CARREGANDO...' : 'ENTRAR'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            {/* AQUI ESTÁ A MUDANÇA: Usando a classe global */}
            <Link href="/register" className="link-neon">
              Crie agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}