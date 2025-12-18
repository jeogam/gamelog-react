'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { authService } from '../services/authService' 

function Navbar() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Marca que o componente montou no cliente
    setMounted(true)
    
    // Verifica o token apenas no lado do cliente
    const token = localStorage.getItem('gamelog_token')
    setIsAuth(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('gamelog_token')
    localStorage.removeItem('gamelog_user')
    setIsAuth(false)
    router.push('/login')
    router.refresh() // Força uma atualização da página para limpar estados
  }

  // Evita renderizar botões de auth antes do JavaScript carregar para não piscar
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
                    <Link className="nav-link btn btn-outline-light" href="/admin">
                      Admin
                    </Link>
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