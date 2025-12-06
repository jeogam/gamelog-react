// src/components/PasswordGate.tsx
'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

interface PasswordGateProps {
  children: ReactNode;
}

function PasswordGate({ children }: PasswordGateProps) {
  const [senhaDigitada, setSenhaDigitada] = useState('')
  const [liberado, setLiberado] = useState(false)
  const [erro, setErro] = useState(false)

  const SENHA_SECRETA = "professor123"

  const verificarSenha = (e: React.FormEvent) => {
    e.preventDefault()
    if (senhaDigitada === SENHA_SECRETA) {
      setLiberado(true)
      setErro(false)
    } else {
      setErro(true)
      setSenhaDigitada('')
    }
  }

  if (liberado) {
    return <>{children}</>
  }

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