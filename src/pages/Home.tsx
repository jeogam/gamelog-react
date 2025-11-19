import { Link } from 'react-router-dom'

// Importando as imagens dos jogos
// O caminho "../assets" significa: "volte uma pasta (saindo de pages) e entre em assets"
import hadesImg from '../assets/images/jogos/hades-thumbnail.jpg'
import btd6Img from '../assets/images/jogos/btd6-thumbnail.jpg'
import eldenImg from '../assets/images/jogos/elden-ring-thumbnail.jpg'

function Home() {
  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">Jogos em Destaque</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        
        {/* Card 1: Hades */}
        <div className="col">
          <Link to="/hades" className="card h-100 text-decoration-none text-light">
            <img src={hadesImg} className="card-img-top" alt="Thumbnail do jogo Hades" />
            <div className="card-body bg-dark">
              <h5 className="card-title">Hades</h5>
              <p className="card-text text-muted">Gênero: Roguelike, Ação</p>
              <p className="card-text">Avaliação: ---</p>
            </div>
          </Link>
        </div>

        {/* Card 2: Bloons TD 6 */}
        <div className="col">
          <Link to="/btd6" className="card h-100 text-decoration-none text-light">
            <img src={btd6Img} className="card-img-top" alt="Thumbnail do jogo BTD6" />
            <div className="card-body bg-dark">
              <h5 className="card-title">Bloons TD 6</h5>
              <p className="card-text text-muted">Gênero: Tower Defense</p>
              <p className="card-text">Avaliação: ---</p>
            </div>
          </Link>
        </div>

        {/* Card 3: Elden Ring */}
        <div className="col">
          <Link to="/elden-ring" className="card h-100 text-decoration-none text-light">
            <img src={eldenImg} className="card-img-top" alt="Thumbnail do jogo Elden Ring" />
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