'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { perfilService } from '../services/perfilService'

const DefaultAvatar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

function Navbar() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('gamelog_token')
    
    if (token) {
      setIsAuth(true)
      perfilService.getMeuPerfil()
        .then(perfil => {
          if (perfil && perfil.avatarImagem) {
            setUserAvatar(perfil.avatarImagem)
          }
        })
        .catch(console.error)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('gamelog_token')
    localStorage.removeItem('gamelog_user')
    setIsAuth(false)
    setUserAvatar(null)
    router.push('/login')
    router.refresh()
  }

  if (!mounted) return <div className="h-20 bg-[#0D1117]"></div>;

  return (
    <>
      {/* 1. Navbar com a classe .navbar-custom que definimos no CSS */}
      <header className="navbar-custom flex items-center justify-center">
        <div className="container mx-auto px-4 flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link className="text-2xl font-bold text-white no-underline hover:text-[#E839C2] transition-colors" href="/">
            👾 GameLog
          </Link>

          {/* Botão Mobile */}
          <button 
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>

          {/* Menu Desktop */}
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row absolute lg:static top-20 left-0 w-full lg:w-auto bg-[#0D1117] lg:bg-transparent border-b lg:border-none border-[#30363d] p-6 lg:p-0 gap-4 items-center shadow-2xl lg:shadow-none`}>
            
            {/* 2. Botão Sandbox agora usa .btn (ROSA) */}
            <Link className="btn w-full lg:w-auto" href="/sandbox">
              Sandbox
            </Link>

            {isAuth ? (
              <>
                {/* Admin pode ser btn-outline para diferenciar levemente, ou .btn se quiser tudo rosa */}
                <Link className="btn btn w-full lg:w-auto" href="/admin">
                  Admin
                </Link>

                <Link 
                  href="/perfil" 
                  className="block rounded-full overflow-hidden border-2 border-[#E839C2] bg-[#21262D] text-[#E839C2] flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_10px_rgba(232,57,194,0.5)]"
                  style={{ width: '42px', height: '42px', minWidth: '42px' }}
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <DefaultAvatar />
                  )}
                </Link>

                <button className="btn btn-danger w-full lg:w-auto" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link className="btn w-full lg:w-auto" href="/login">
                  Login
                </Link>
                <Link className="btn btn-outline w-full lg:w-auto" href="/register">
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      {/* Espaçador para o conteúdo não ficar atrás da navbar */}
      <div className="h-20"></div>
    </>
  )
}

export default Navbar