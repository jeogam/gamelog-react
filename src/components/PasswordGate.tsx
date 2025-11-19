import { useState } from 'react'
import type { ReactNode } from 'react'

interface PasswordGateProps {
  children: ReactNode; // O conteúdo que queremos proteger
}

function PasswordGate({ children }: PasswordGateProps) {
  const [senhaDigitada, setSenhaDigitada] = useState('')
  const [liberado, setLiberado] = useState(false)
  const [erro, setErro] = useState(false)

  // Defina sua senha secreta aqui (pode ser qualquer coisa)
  const SENHA_SECRETA = "professor123"

  const verificarSenha = (e: React.FormEvent) => {
    e.preventDefault()
    if (senhaDigitada === SENHA_SECRETA) {
      setLiberado(true)
      setErro(false)
    } else {
      setErro(true)
      setSenhaDigitada('') // Limpa o campo
    }
  }

  // Se já estiver liberado, mostra o conteúdo protegido (a página Sandbox)
  if (liberado) {
    return <>{children}</>
  }

  // Se não, mostra a tela de bloqueio
  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card border-secondary bg-dark text-light">
        <div className="card-header text-center">
          <h3>🔒 Área Restrita</h3>
        </div>
        <div className="card-body">
          <p className="text-muted text-center">Digite a senha para acessar o Sandbox.</p>
          
          <form onSubmit={verificarSenha}>
            <div className="mb-3">
              <input 
                type="password" 
                className="form-control text-center" 
                placeholder="Senha"
                value={senhaDigitada}
                onChange={(e) => setSenhaDigitada(e.target.value)}
                autoFocus
              />
            </div>
            
            {erro && <div className="alert alert-danger py-1 text-center">Senha incorreta!</div>}
            
            <button type="submit" className="btn btn-success w-100">Desbloquear</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordGate