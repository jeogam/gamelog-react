import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="text-center mt-5"> 
        
        <h2 className="display-5 fw-bold mb-3">Bem-vindo ao GameLog! 🚀</h2> 
    
        <p className="lead mb-4">Seu Hub Definitivo para Rastrear, Avaliar e Descobrir Jogos.</p> 
    
        <p>
            O GameLog está sendo construído para ser o companheiro perfeito de todo gamer. 
            Mantenha um registro detalhado dos jogos que você já jogou, está jogando ou quer explorar. 
            Escreva reviews, compartilhe suas notas e conecte-se com uma comunidade apaixonada por games!
        </p>
    
        <p className="text-muted">
          <small><em>Nota: Este é atualmente um protótipo visual. Funcionalidades como salvar dados serão implementadas nas próximas fases.</em></small>
        </p>

        <Link className="btn btn-primary btn-lg mt-4" to="/home">
          Explore o Protótipo
        </Link> 

    </div>
  )
}

export default Landing