// app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/authService' // Mantenha o service

function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  })

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro('')
    setLoading(true)

    try {
      // ⚠️ Substitua o mock pela chamada real
      await authService.register(formData) // CHAMA O BACKEND
      setSucesso(true)
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      setErro(error.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mt-5">
        <h1>Crie a sua Conta</h1>
        
        <form onSubmit={handleRegister} className="login-form">
            
            {erro && (
              <div className="alert alert-danger" role="alert">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="alert alert-success" role="alert">
                Conta criada com sucesso! Redirecionando para o login...
              </div>
            )}

            <div className="mb-3"> 
                <label htmlFor="nome" className="form-label">Nome Completo:</label> 
                <input 
                  type="text" 
                  className="form-control" 
                  id="nome" 
                  name="nome" 
                  required 
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                /> 
            </div>

            <div className="mb-3"> 
                <label htmlFor="email" className="form-label">E-mail:</label> 
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange} 
                />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 mb-3"
              disabled={loading || sucesso}
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>

            <div className="text-center">
                <small className="text-muted">Já tem uma conta? <Link href="/login">Faça Login</Link></small>
            </div>
        </form>
    </main>
  )
}

export default Register