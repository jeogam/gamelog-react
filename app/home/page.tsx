// app/home/page.tsx

import Link from 'next/link'
import Image from 'next/image'

function Home() {
  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">Jogos em Destaque</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        
        {/* Card 1: Hades */}
        <div className="col">
          <Link href="/hades" className="card h-100 text-decoration-none text-light">
            <Image 
                src="/images/jogos/hades-thumbnail.jpg" 
                className="card-img-top" 
                alt="Thumbnail do jogo Hades" 
                width={400} 
                height={225} 
            />
            <div className="card-body bg-dark">
              <h5 className="card-title">Hades</h5>
              <p className="card-text text-muted">Gênero: Roguelike, Ação</p>
              <p className="card-text">Avaliação: ---</p>
            </div>
          </Link>
        </div>

        {/* Card 2: Bloons TD 6 */}
        <div className="col">
          <Link href="/btd6" className="card h-100 text-decoration-none text-light">
            <Image 
                src="/images/jogos/btd6-thumbnail.jpg" 
                className="card-img-top" 
                alt="Thumbnail do jogo BTD6" 
                width={400} 
                height={225} 
            />
            <div className="card-body bg-dark">
              <h5 className="card-title">Bloons TD 6</h5>
              <p className="card-text text-muted">Gênero: Tower Defense</p>
              <p className="card-text">Avaliação: ---</p>
            </div>
          </Link>
        </div>

        {/* Card 3: Elden Ring */}
        <div className="col">
          <Link href="/elden-ring" className="card h-100 text-decoration-none text-light">
            <Image 
                src="/images/jogos/elden-ring-thumbnail.jpg" 
                className="card-img-top" 
                alt="Thumbnail do jogo Elden Ring" 
                width={400} 
                height={225} 
            />
            <div className="card-body bg-dark">
              <h5 className="card-title">Elden Ring</h5>
              <p className="card-text text-muted">Gênero: RPG de Ação</p>
              <p className="card-text">Avaliação: ---</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Home