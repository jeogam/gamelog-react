// app/admin/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService' // Importando o serviço atualizado
import ProtectedRoute from '@/components/ProtectedRoute' // Importando o componente de proteção

function Admin() {
  const router = useRouter()

  const handleLogout = () => {
    authService.logout() // Usa o método centralizado do serviço
  }

  return (
    // AQUI ESTÁ A PROTEÇÃO: Só quem tem role "ADMINISTRADOR" entra
    <ProtectedRoute allowedRoles={['ADMINISTRADOR']}>
        <main className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Painel de Administração</h1>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Sair
                </button>
            </div>
            
            <p>Lista de usuários cadastrados no sistema.</p>

            <div className="table-responsive"> 
                <table className="table table-dark table-striped table-hover admin-table">
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Usuário">Teste Usuario</td>
                            <td data-label="Email">teste@gmail.com</td>
                            <td data-label="Ações">
                                <a href="#" className="btn btn-sm btn-info btn-action edit me-2">Editar</a> 
                                <a href="#" className="btn btn-sm btn-danger btn-action delete">Excluir</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </ProtectedRoute>
  )
}

export default Admin