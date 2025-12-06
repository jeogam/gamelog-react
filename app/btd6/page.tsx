// app/btd6/page.tsx

import Link from 'next/link' // Troca de import

function Btd6() {
  return (
    <main className="text-center py-5">
        <h1 className="mb-4">Bloons TD 6</h1>
        <p className="lead text-secondary">Página em construção...</p>
        
        <Link className="btn btn-success" href="/home">
            Voltar para Home
        </Link>
    </main>
  )
}

export default Btd6