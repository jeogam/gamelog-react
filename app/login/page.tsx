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
      // CORREÇÃO AQUI: Passando um objeto { email, senha } ao invés de variáveis soltas
      const response = await authService.login({ email, senha });
      
      if (response && response.token) {
        // Redirecionamento completo para carregar a Navbar corretamente
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0D1117]">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070&auto=format&fit=crop')" }}
      />
      
      <div className="glass-panel animate-fade-up z-10 w-full max-w-md rounded-2xl p-8 m-4">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Game<span style={{ color: '#E839C2' }}>Log</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Sua biblioteca definitiva</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {erro && (
            <div className="rounded bg-red-500/20 p-3 text-center text-sm text-red-200 border border-red-500/30">
              {erro}
            </div>
          )}

          <div className="relative group">
            <span className="absolute left-3 top-3.5 text-gray-500 text-xl pointer-events-none group-focus-within:text-[#E839C2] transition-colors">
              @
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

          <div className="relative group">
            <span className="absolute left-3 top-3.5 text-gray-500 text-xl pointer-events-none group-focus-within:text-[#E839C2] transition-colors">
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
            {loading ? 'ACESSANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Ainda não tem conta?{' '}
          <Link href="/register" className="font-bold hover:underline" style={{ color: '#E839C2' }}>
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}