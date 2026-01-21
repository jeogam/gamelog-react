// app/page.tsx
import Link from 'next/link'

function Landing() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
       
       <div className="text-center max-w-lg">
          {/* Título com destaque na pontuação */}
          <h1 className="display-3 fw-bold mb-4 text-white">
            Bem-vindo ao GameLog <span style={{ color: '#E839C2' }}>.</span>
          </h1>
          
          <h2 className="h4 mb-4 text-muted">
            Seu Hub Definitivo para Rastrear, Avaliar e Descobrir Jogos.
          </h2>
          
          <p className="lead mb-5 mx-auto text-secondary" style={{ maxWidth: '700px' }}>
             O GameLog é o companheiro perfeito para todo gamer. 
             Mantenha o registro do que você já zerou, descubra novas aventuras e organize sua coleção.
          </p>

          {/* Área dos Botões de Ação */}
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
             
             {/* 1. Botão para Buscar/Explorar (Leva para /busca) */}
             <Link 
                className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg d-flex align-items-center gap-2" 
                href="/busca"
                style={{ transition: 'transform 0.2s' }}
             >
                🔍 Explorar Jogos
             </Link>

             {/* 2. Botão para Biblioteca (Leva para /home) */}
             <Link 
                className="btn btn-outline-light btn-lg px-5 py-3 fw-bold d-flex align-items-center gap-2" 
                href="/home"
             >
                🎮 Abrir Biblioteca
             </Link>

          </div>

          <div className="mt-5 text-muted small">
             <p>Ainda não tem conta? <Link href="/register" className="text-decoration-none" style={{ color: '#E839C2' }}>Crie agora</Link> para salvar seu progresso.</p>
          </div>
       </div>

    </div>
  )
}

export default Landing