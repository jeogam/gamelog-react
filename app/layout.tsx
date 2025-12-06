// app/layout.tsx

// 1️⃣ Bootstrap primeiro (ele será sobrescrito pelo seu CSS)
import 'bootstrap/dist/css/bootstrap.min.css'

// 2️⃣ Seu CSS global por último (ele vence a prioridade)
import './globals.css'

// Components
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'GameLog: Seu Hub Definitivo de Jogos',
  description: 'Rastreie, Avalie e Descubra Jogos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <div className="container">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
