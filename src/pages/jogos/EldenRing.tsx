import { Link } from 'react-router-dom'

function EldenRing() {
  return (
    <main className="text-center py-5">
        <h1 className="mb-4">Elden Ring</h1>
        <p className="lead text-secondary">Página em construção...</p>
        
        <Link className="btn btn-success" to="/home">
            Voltar para Home
        </Link>
    </main>
  )
}

export default EldenRing