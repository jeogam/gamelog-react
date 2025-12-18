// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/authService' 

function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro('')
    setLoading(true)

    try {
      // CORREÇÃO 1: Passar um objeto { email, senha } e não parâmetros soltos
      await authService.login({ email, senha }) 
      
      // CORREÇÃO 2: Remover os localStorage.setItem manuais daqui.
      // O authService já faz isso da forma correta (incluindo salvar o papel/role).
      
      // Redireciona para o Admin (ou Home)
      // Dica: router.refresh() ajuda a atualizar o Navbar imediatamente
      router.push('/admin')
      router.refresh() 
      
    } catch (error) {
      setErro('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mt-5">
        <h1>Acesse a sua Conta</h1>
        
        <form onSubmit={handleLogin} className="login-form">
            
            {erro && (
              <div className="alert alert-danger" role="alert">
                {erro}
              </div>
            )}

            <div className="mb-3"> 
                <label htmlFor="email" className="form-label">E-mail:</label> 
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="Digite o seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                /> 
            </div>

            <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha:</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="senha" 
                  name="senha" 
                  required 
                  placeholder="Digite a sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)} 
                />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <div className="text-center mt-3">
                <small className="text-muted">Não tem conta? <Link href="/register">Cadastre-se</Link></small>
            </div>
        </form>
    </main>
  )
}

export default Login