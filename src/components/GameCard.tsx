"use client";

import Image from "next/image";

type StatusJogo = "QUERO_JOGAR" | "JOGANDO" | "FINALIZADO" | "DESISTIDO";

const STATUS_LABEL: Record<StatusJogo, string> = {
  QUERO_JOGAR: "Quero jogar",
  JOGANDO: "Jogando",
  FINALIZADO: "Finalizado",
  DESISTIDO: "Desistido",
};

interface GameCardProps {
  game: {
    id: number | string;
    name: string;
    background_image: string;

    // RAWG (busca)
    released?: string | null;

    // Biblioteca (home/biblioteca)
    status?: StatusJogo;
    favorito?: boolean;
  };

  onViewDetails: (game: any) => void;
  isLoading?: boolean;
}

function getYear(released?: string | null) {
  if (!released) return null;
  const year = released.split("-")[0];
  return year && year.length === 4 ? year : null;
}

export default function GameCard({ game, onViewDetails, isLoading = false }: GameCardProps) {
  const year = getYear(game.released);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-sm transition hover:border-white/20">
      <div className="relative h-[200px] w-full">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800 text-zinc-300">
            ?
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-zinc-100">{game.name}</h3>

        <p className="mt-1 text-sm text-zinc-400">
          {game.status ? STATUS_LABEL[game.status] : year ?? "—"}
        </p>

        <button
          className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-400"
          onClick={() => onViewDetails(game)}
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Ver detalhes"}
        </button>
      </div>
    </div>
  );
}
