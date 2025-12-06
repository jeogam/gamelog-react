// app/sandbox/atividade-3/page.tsx

import Link from 'next/link'
import Image from 'next/image'
// ⚠️ Ajuste o caminho relativo de importação
import terrariaCapa from '@/assets/images/terraria-capa.png'

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
      
      {/* Usando o componente Image do Next.js */}
      <Image 
        src={terrariaCapa} 
        alt="Capa do jogo Terraria" 
        className="img-fluid rounded" 
        width={400} 
        height={400}
      />

      <div className="mt-4 text-center">
        <Link className="btn btn-secondary" href="/sandbox">Voltar</Link>
      </div>
    </main>
  )
}

export default Atividade3