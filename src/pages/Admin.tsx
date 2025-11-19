import { Link } from 'react-router-dom'

function Admin() {
  return (
    <main className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Painel de Administração</h1>
            <Link className="btn btn-danger" to="/">Sair</Link>
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
                    <tr>
                        <td data-label="Usuário">Maria Silva</td>
                        <td data-label="Email">maria@example.com</td>
                        <td data-label="Ações">
                            <a href="#" className="btn btn-sm btn-info btn-action edit me-2">Editar</a>
                            <a href="#" className="btn btn-sm btn-danger btn-action delete">Excluir</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
  )
}

export default Admin