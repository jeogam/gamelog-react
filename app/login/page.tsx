'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      await authService.login({ email, senha });
      router.push('/home');
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setErro('Credenciais incorretas.');
      } else {
        setErro('Erro de conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fundo escuro com uma imagem sutil por baixo
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0D1117]">
      {/* Imagem de Fundo (opcional) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070&auto=format&fit=crop')" }}
      />
      
      {/* Card Central */}
      <div className="glass-panel animate-fade-up z-10 w-full max-w-md rounded-2xl p-8">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Game<span style={{ color: '#E839C2' }}>Log</span>
          </h1>
          <p className="text-gray-400 text-sm">Sua biblioteca definitiva</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {erro && (
            <div className="rounded bg-red-500/20 p-3 text-center text-sm text-red-200 border border-red-500/30">
              {erro}
            </div>
          )}

          {/* Input Email */}
          <div className="relative group">
            <span className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[#E839C2]">
              📧
            </span>
            <input
              type="email"
              placeholder="Email"
              className="input-gamer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Senha */}
          <div className="relative group">
            <span className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[#E839C2]">
              🔒
            </span>
            <input
              type="password"
              placeholder="Senha"
              className="input-gamer"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gamer">
            {loading ? 'Acessando...' : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Ainda não tem conta?{' '}
          <Link href="/register" style={{ color: '#E839C2' }} className="hover:underline font-bold">
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}