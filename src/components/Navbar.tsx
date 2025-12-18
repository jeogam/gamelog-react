'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation' // 1. IMPORTAR usePathname
import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'

function Navbar() {
  const router = useRouter()
  const pathname = usePathname() // 2. PEGAR A ROTA ATUAL
  
  const [isAuth, setIsAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Verifica Token
    const autenticado = authService.isAuthenticated()
    setIsAuth(autenticado)

    // Verifica Role
    const role = authService.getRole()
    
    // Verifica se é ADMINISTRADOR
    setIsAdmin(role === 'ADMINISTRADOR')
    
  }, [pathname]) // 3. ADICIONAR pathname AQUI (Isso força a re-verificação ao mudar de página)

  const handleLogout = () => {
    authService.logout()
    // Atualiza estados locais imediatamente para feedback visual
    setIsAuth(false)
    setIsAdmin(false)
    router.refresh()
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
                    {isAdmin && (
                      <Link className="nav-link btn btn-outline-light" href="/admin">
                        Admin
                      </Link>
                    )}
                    
                    <button className="nav-link btn btn-danger text-white border-0" onClick={handleLogout}>
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