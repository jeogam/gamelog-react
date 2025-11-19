import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault() // Impede o recarregamento da página
    // Aqui futuramente entraria a lógica de validação com o backend
    navigate('/admin') // Redireciona para a rota /admin
  }

  return (
    <main className="mt-5">
        <h1>Acesse sua Conta</h1>
        
        <form onSubmit={handleLogin} className="login-form">
            
            <div className="mb-3"> 
                <label htmlFor="email" className="form-label">E-mail:</label> 
                <input type="email" className="form-control" id="email" name="email" required placeholder="Digite seu e-mail" /> 
            </div>

            <div className="mb-3">
                <label htmlFor="senha" className="form-label">Senha:</label>
                <input type="password" className="form-control" id="senha" name="senha" required placeholder="Digite sua senha" />
            </div>

            <button type="submit" className="btn btn-primary">Entrar</button>
        </form>
    </main>
  )
}

export default Login