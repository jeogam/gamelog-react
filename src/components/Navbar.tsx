import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          
          {/* Link para a Home (Raiz) */}
          <Link className="navbar-brand logo" to="/">
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
              <li className="nav-item d-flex align-items-center">
                {/* Link para Sandbox */}
                <Link className="nav-link btn btn-success mx-1 text-white" to="/sandbox">
                  Sandbox
                </Link>
                
                {/* Link para Login */}
                <Link className="nav-link btn btn-success mx-1 text-white" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar