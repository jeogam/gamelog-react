// app/sandbox/atividade-4/page.tsx

import Link from 'next/link'
import terrariaAudio from '@/assets/audio/terraria-theme.mp3'

function Atividade4() {
  return (
    <main className="mt-4">
      <h1>Atividade 4: Mídia</h1>
      <p>Esta atividade contém exemplos de áudio e vídeo responsivo.</p>

      <h2>Áudio</h2>
      <audio controls className="mb-4 w-100">
        <source src={terrariaAudio} type="audio/mpeg" />
        <p>Seu navegador não suporta áudio.</p>
      </audio>

      <h2>Vídeo Externo Responsivo</h2>
      <div className="video-container mb-4">
        <iframe 
          src="https://www.youtube.com/embed/4-cT9n8QNAk?si=yB2XWWz3jLSiEpEC" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>

      <div className="mt-4 text-center">
        <Link className="btn btn-secondary" href="/sandbox">Voltar</Link>
      </div>
    </main>
  )
}

export default Atividade4