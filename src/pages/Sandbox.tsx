import { Link } from 'react-router-dom'

// Importando as thumbnails das atividades
import ativ3Img from '../assets/images/atividade-3.png'
import ativ4Img from '../assets/images/atividade-4.png'
import ativ5Img from '../assets/images/atividade-5.png'

function Sandbox() {
  return (
    <main className="mt-4 text-center">
      <h1>Sandbox das Atividades</h1>
      <p>Aqui estão as atividades da disciplina de Programação Web. Clique em um card para ver a atividade.</p>

      <section className="activity-grid mt-4">
        
        <Link to="/sandbox/atividade-3" className="activity-card">
          <img src={ativ3Img} alt="Thumbnail da Atividade 3" />
          <h3>Atividade 3: Listas e Imagens</h3>
        </Link>

        <Link to="/sandbox/atividade-4" className="activity-card">
          <img src={ativ4Img} alt="Thumbnail da Atividade 4" />
          <h3>Atividade 4: Mídia e CSS</h3>
        </Link>

        <Link to="/sandbox/atividade-5" className="activity-card">
          <img src={ativ5Img} alt="Thumbnail da Atividade 5" />
          <h3>Atividade 5: Paleta de Cores</h3>
        </Link>

      </section>
    </main>
  )
}

export default Sandbox