// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
<<<<<<< Updated upstream
// import { authService } from '../services/authService' // Mantenha a importação do seu service

function Navbar() {
  const router = useRouter()
  
  // Verifica autenticação usando localStorage (deve ser migrado para Cookies + Middleware)
  const isAuth = typeof window !== 'undefined' && !!localStorage.getItem('gamelog_token')

  const handleLogout = () => {
    // authService.logout() 
    localStorage.removeItem('gamelog_token')
    localStorage.removeItem('gamelog_user')
    router.push('/')
=======
import { useEffect, useState } from 'react'
import { authService } from '@/services/authService' // Importe o authService!

function Navbar() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // Estado para Admin
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Verifica Token
    const autenticado = authService.isAuthenticated()
    setIsAuth(autenticado)

    // Verifica Role (Papel)
    const role = authService.getRole()
    console.log("Navbar check - Role:", role) // Debug
    
    // Verifica se é ADMINISTRADOR (Ajuste a string se o backend mandar diferente)
    setIsAdmin(role === 'ADMINISTRADOR')
    
  }, [])

  const handleLogout = () => {
    authService.logout()
  }

  if (!mounted) {
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                <div className="container-fluid">
                    <Link className="navbar-brand logo" href="/">🎮 GameLog</Link>
                </div>
            </nav>
        </header>
    )
>>>>>>> Stashed changes
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          
          <Link className="navbar-brand logo" href="/">
            🎮 GameLog
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item d-flex align-items-center gap-2">
                <Link className="nav-link btn btn-success text-white" href="/sandbox">
                  Sandbox
                </Link>
                
                {isAuth ? (
                  <>
<<<<<<< Updated upstream
                    <Link className="nav-link btn btn-outline-light" href="/admin">
                      Admin
                    </Link>
                    <button className="nav-link btn btn-danger text-white" onClick={handleLogout}>
=======
                    {/* Só mostra botão Admin se for admin */}
                    {isAdmin && (
                      <Link className="nav-link btn btn-outline-light" href="/admin">
                        Admin
                      </Link>
                    )}
                    
                    <button className="nav-link btn btn-danger text-white border-0" onClick={handleLogout}>
>>>>>>> Stashed changes
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="nav-link btn btn-primary text-white" href="/login">
                      Login
                    </Link>
                    <Link className="nav-link btn btn-outline-light" href="/register">
                      Cadastrar
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar