// Importamos a imagem que será usada na página
import hadesPromo from '../assets/images/jogos/hades-promo-art.png'

function Hades() {
  return (
    <main className="mt-4">
        {/* Título da Página */}
        <div className="row mb-4">
            <div className="col-12">
                <h1 className="display-4 border-bottom pb-2">Hades</h1>
            </div>
        </div>

        <div className="row">
            {/* Coluna Principal (Texto e Imagem) */}
            <div className="col-lg-8">
                <p className="lead">
                    Hades é um jogo eletrônico de ação e RPG do gênero <em>roguelike</em> desenvolvido e publicado pela Supergiant Games. 
                    Aclamado pela crítica, o jogo venceu diversos prêmios de "Jogo do Ano" (GOTY) e é conhecido por sua jogabilidade viciante, 
                    direção de arte deslumbrante e uma narrativa que se desenrola a cada tentativa de fuga.
                </p>

                {/* Imagem Importada */}
                <img 
                    src={hadesPromo} 
                    className="img-fluid rounded shadow-sm mb-4" 
                    alt="Arte promocional do jogo Hades" 
                />

                <h2 className="mt-4">A Trama: Fuga do Submundo</h2>
                <p>
                    Você joga como <strong>Zagreus</strong>, o príncipe do Submundo e filho de Hades. Cansado da vida sob o domínio de seu pai, Zagreus decide 
                    escapar de Tártaro e do resto do reino dos mortos para se juntar aos seus parentes no Monte Olimpo.
                </p>
                <p>
                    Sua jornada é auxiliada pelos deuses do Olimpo (como Zeus, Atena, Poseidon e outros), que lhe concedem "Bênçãos" 
                    (poderes e melhorias) para ajudá-lo a lutar contra as hordas de inimigos. A morte é uma parte central do jogo: a cada falha, 
                    Zagreus é enviado de volta ao Palácio de Hades, onde pode interagir com outros personagens, fortalecer suas habilidades 
                    permanentes e tentar a fuga novamente.
                </p>

                <h2 className="mt-4">Jogabilidade e Recursos</h2>
                <ul>
                    <li><strong>Ação Frenética:</strong> Combate <em>hack-and-slash</em> rápido que exige reflexos e estratégia.</li>
                    <li><strong>Bênçãos dos Deuses:</strong> Combine poderes de diferentes deuses para criar <em>builds</em> únicas a cada partida.</li>
                    <li><strong>Meta-progressão:</strong> Use recursos coletados para desbloquear melhorias permanentes, novas armas (Armas Infernais) e habilidades no Espelho da Noite.</li>
                    <li><strong>Narrativa Emergente:</strong> A história avança a cada tentativa, seja ela um sucesso ou um fracasso, com milhares de linhas de diálogo.</li>
                </ul>
            </div>

            {/* Coluna Lateral (Ficha Técnica e Trailer) */}
            <div className="col-lg-4">
                <div className="card bg-dark text-light border-secondary mb-4">
                    <div className="card-header">
                        Ficha Técnica
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li><strong>Desenvolvedora:</strong> Supergiant Games</li>
                            <li><strong>Gênero:</strong> Roguelike, Ação RPG</li>
                            <li><strong>Lançamento:</strong> 17 de setembro de 2020</li>
                            <li><strong>Plataformas:</strong> PC, Nintendo Switch, PlayStation, Xbox</li>
                        </ul>
                    </div>
                </div>

                <h3 className="h5">Trailer de Lançamento</h3>
                <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm">
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/91t0ha9x0AE?si=U1mtoqZt3W3AeS1L" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Hades