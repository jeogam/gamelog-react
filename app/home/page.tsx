'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bibliotecaService } from '@/services/bibliotecaService'; // 👈 Usamos bibliotecaService agora
import { perfilService } from '@/services/perfilService';
import GameCard from '@/components/GameCard';
import GameCardSkeleton from '@/components/GameCardSkeleton';

export default function Home() {
  const router = useRouter();
  const [biblioteca, setBiblioteca] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuarioNome, setUsuarioNome] = useState('');

  useEffect(() => {
    async function fetchMinhaBiblioteca() {
      try {
        // 1. Descobre quem é o usuário
        const perfil = await perfilService.getMeuPerfil();
        if (perfil?.usuarioId) {
            setUsuarioNome(perfil.nomeExibicao);
            
            // 2. Busca SÓ a biblioteca dele
            const dados = await bibliotecaService.getBibliotecaDoUsuario(perfil.usuarioId);
            setBiblioteca(dados);
        } else {
            // Se não tiver perfil/login, manda pro login
            router.push('/login');
        }
      } catch (error) {
        console.error("Erro ao carregar biblioteca:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMinhaBiblioteca();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold" style={{ color: '#F0F6FC' }}>
        Biblioteca de {usuarioNome || '...'}
      </h2>

      {loading ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
           <GameCardSkeleton /><GameCardSkeleton /><GameCardSkeleton />
        </div>
      ) : biblioteca.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p>Sua biblioteca está vazia.</p>
          <a href="/busca" className="btn btn-outline-primary">Ir para Explorar</a>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {biblioteca.map((item) => (
            <div className="col" key={item.id}>
              {/* O item da biblioteca tem status, favorito, etc. O jogo está "dentro" logicamente */}
              <GameCard 
                game={{
                    id: item.jogoId, // UUID do jogo
                    name: item.tituloJogo,
                    background_image: item.capaUrl, // Agora temos a capa!
                    released: item.status // Gambiarra visual: Mostra o status (JOGANDO, ZERADO) no card
                }}
                onImport={() => router.push(`/jogo/${item.jogoId}`)}
                isImporting={false} 
              />
              {/* Badge de Status */}
              <div className="text-center mt-2">
                  <span className={`badge ${item.status === 'ZERADO' ? 'bg-success' : 'bg-primary'}`}>
                    {item.status}
                  </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}