"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Star, List, Pencil } from "lucide-react";
import type { Perfil } from "@/interfaces/Perfil";
import MinhasListasTab from "./MinhasListasTab"; // Importe o componente criado

// --- Sub-componentes visuais ---

function AvatarGlow({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-full bg-indigo-500/20 blur-xl" />
      <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-zinc-900">
        <img
          src={src || "https://via.placeholder.com/150"}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  onClick, // Adicionado onClick opcional
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onClick?: () => void;
}) {
  const Component = onClick ? "button" : "div";
  return (
    <Component 
      onClick={onClick}
      className={`w-full text-left rounded-xl border border-white/10 bg-zinc-950/40 p-4 transition-all hover:border-white/20 ${onClick ? 'hover:bg-zinc-900/80 active:scale-95 cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2 text-zinc-300">
        <div className="text-zinc-400">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-100">{value}</div>
    </Component>
  );
}

// --- Componente Principal ---

export default function PerfilView({
  perfil,
  isMeuPerfil,
}: {
  perfil: Perfil;
  isMeuPerfil: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"geral" | "listas">("geral");

  const jogos = perfil.stats?.jogos ?? 0;
  const reviews = perfil.stats?.reviews ?? 0;
  // O backend pode retornar stats.listas, senão assume 0 por enquanto
  const listasCount = perfil.stats?.listas ?? 0; 

  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/40 p-6 shadow-sm">
      {/* Header (Fixo) */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <AvatarGlow src={perfil.avatarImagem} alt={perfil.nomeExibicao} />
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">{perfil.nomeExibicao}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-400">Membro do GameLog</span>
              <span className="rounded-md border border-indigo-400/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-200">
                PLAYER
              </span>
            </div>
          </div>
        </div>

        {isMeuPerfil && (
          <Link
            href="/perfil/editar"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        )}
      </div>

      {/* Navegação de Abas */}
      <div className="mt-8 mb-6 flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("geral")}
          className={`relative px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "geral" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Visão Geral
          {activeTab === "geral" && (
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("listas")}
          className={`relative px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "listas" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Minhas Listas
          {activeTab === "listas" && (
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          )}
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="min-h-[200px]">
        {activeTab === "geral" ? (
          // Conteúdo Original da Visão Geral
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bio */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Sobre
              </h3>
              <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/60 p-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                  {perfil.biografia?.trim()
                    ? perfil.biografia
                    : "Este usuário ainda não escreveu uma biografia."}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard 
                icon={<Gamepad2 className="h-4 w-4" />} 
                label="Jogos" 
                value={jogos} 
              />
              <StatCard 
                icon={<Star className="h-4 w-4" />} 
                label="Reviews" 
                value={reviews} 
              />
              <StatCard 
                icon={<List className="h-4 w-4" />} 
                label="Listas" 
                value={listasCount}
                onClick={() => setActiveTab("listas")} // Clicar aqui leva para a aba de listas
              />
            </div>
          </div>
        ) : (
          // Nova Aba de Listas
          <MinhasListasTab usuarioId={perfil.usuarioId} isMeuPerfil={isMeuPerfil} />
        )}
      </div>
    </div>
  );
}