'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      // CORREÇÃO AQUI: Passando o objeto formData direto, pois ele já tem {nome, email, senha}
      await authService.register(formData);
      
      alert("Conta criada com sucesso! Faça login.");
      router.push('/login');
    } catch (error: any) {
      setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0D1117]">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop')" }}
      />

      <div className="glass-panel animate-fade-up z-10 w-full max-w-md rounded-2xl p-8 m-4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-white">Criar Conta</h2>
          <p className="text-gray-400 text-sm mt-2">Entre para o squad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <div className="rounded bg-red-500/20 p-3 text-center text-sm text-red-200 border border-red-500/30">
              {erro}
            </div>
          )}

          <div className="relative group">
            <span className="absolute left-3 top-3.5 text-gray-500 text-xl pointer-events-none group-focus-within:text-[#E839C2] transition-colors">
              👤
            </span>
            <input
              type="text"
              placeholder="Nome de Usuário"
              className="input-gamer"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <span className="absolute left-3 top-3.5 text-gray-500 text-xl pointer-events-none group-focus-within:text-[#E839C2] transition-colors">
              @
            </span>
            <input
              type="email"
              placeholder="Email"
              className="input-gamer"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gamer mt-4">
            {loading ? 'CRIANDO...' : 'CADASTRAR'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Já tem login? <Link href="/login" className="font-bold hover:underline" style={{ color: '#E839C2' }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}