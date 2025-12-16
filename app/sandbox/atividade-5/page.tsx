import Link from 'next/link'

function Atividade5() {
  return (
    <main className="mt-4">
      <h1>Atividade 5: Definição da Paleta de Cores</h1>

      <div>
        <h2>Paleta Adotada: "Neon Noturno"</h2>
        <p>
          A paleta "Neon Noturno" foi escolhida para criar uma atmosfera imersiva, moderna e familiar ao público gamer.
          Ela se baseia em um tema escuro, que é mais confortável para a visão em longas sessões de uso.
        </p>
      </div>

      <div className="color-info mt-4">
        <h3>Cor Principal (Destaque)</h3>
        <p>A cor principal de destaque é o <strong>Magenta Vibrante (#E839C2)</strong>.</p>
        <p>
          <strong>Justificativa:</strong> Esta cor está diretamente associada à estética <strong>cyberpunk e gamer</strong>.
          Ela representa energia, ação e modernidade.
        </p>
      </div>

      <div className="color-info mt-4">
        <h3>Tipo de Paleta</h3>
        <p>O tipo de paleta adotado é uma <strong>Paleta de Contraste em Modo Escuro</strong>:</p>
        
        <ul className="list-group list-group-flush mb-3">
          <li className="list-group-item bg-transparent text-light"><strong>Cor Dominante (#0D1117):</strong> Azul quase preto para o fundo.</li>
          <li className="list-group-item bg-transparent text-light"><strong>Cor Secundária (#21262D):</strong> Cinza-escuro para elementos em primeiro plano.</li>
          <li className="list-group-item bg-transparent text-light"><strong>Cor de Destaque (#E839C2):</strong> O magenta para guiar a atenção.</li>
        </ul>

        <div className="swatch-container d-flex gap-2">
          <div className="color-swatch" style={{ width: '100px', height: '100px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#0D1117' }}></div>
          <div className="color-swatch" style={{ width: '100px', height: '100px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#21262D' }}></div>
          <div className="color-swatch" style={{ width: '100px', height: '100px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#E839C2' }}></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link className="btn btn-secondary" href="/sandbox">Voltar</Link>
      </div>
    </main>
  )
}

export default Atividade5