import { Link } from 'react-router-dom'
import terrariaCapa from '../../assets/images/terraria-capa.png'

function Atividade3() {
  return (
    <main className="mt-4">
      <h1>Atividade 3</h1>
      
      <h3>Minha Lista de Jogos</h3>
      <ul className="list-group list-group-flush mb-4" style={{ maxWidth: '300px', margin: 'auto' }}>
        <li className="list-group-item bg-transparent text-light">Minecraft</li>
        <li className="list-group-item bg-transparent text-light">Bloons TD 6</li>
        <li className="list-group-item bg-transparent text-light">Brawl Stars</li>
        <li className="list-group-item bg-transparent text-light">Stardew Valley</li>
        <li className="list-group-item bg-transparent text-light">Terraria</li>
        <li className="list-group-item bg-transparent text-light">Celeste</li>
      </ul>

      <h3>Imagem Dinâmica e Responsiva</h3>
      <p>Esta imagem irá se ajustar ao tamanho da tela.</p>
      
      <picture>
        <source media="(max-width: 1050px)" srcSet={terrariaCapa} />
        <img src={terrariaCapa} className="img-fluid rounded" alt="Capa do jogo Terraria" />
      </picture>

      <div className="mt-4 text-center">
        <Link className="btn btn-secondary" to="/sandbox">Voltar</Link>
      </div>
    </main>
  )
}

export default Atividade3