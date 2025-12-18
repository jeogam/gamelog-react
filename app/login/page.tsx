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
      // 1. Faz o login (salva token e papel no localStorage)
      await authService.login({ email, senha }) 
      
      // 2. Redireciona TODO MUNDO para a Home
      // O Navbar já vai detectar que é Admin e mostrar o botão lá
      router.push('/')
      router.refresh() // Garante que a Navbar atualize o estado
      
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