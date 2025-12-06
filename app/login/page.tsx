// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { authService } from '../../src/services/authService' // Mantenha o service

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
      // ⚠️ Use authService.login(email, senha) e certifique-se que ele salva o JWT como um COOKIE
      // O Next.js Middleware precisa do Cookie. Se usar localStorage, o Middleware não funciona.
      // const data = await authService.login(email, senha) 
      
      // Simulação de sucesso:
      const data = { token: 'mock-jwt-token' }; 
      localStorage.setItem('gamelog_token', data.token)
      localStorage.setItem('gamelog_user', email)

      router.push('/admin')
      
    } catch (error) {
      setErro('Email ou palavra-passe incorretos.')
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
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
            <div className="text-center mt-3">
                <small className="text-muted">Não tem conta? <Link href="/register">Cadastre-se</Link></small>
            </div>
        </form>
    </main>
  )
}

export default Login