"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { perfilService } from "../services/perfilService";
import type { Perfil } from "@/interfaces/Perfil";

const DefaultAvatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

function Navbar() {
  const router = useRouter();

  const [isAuth, setIsAuth] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // ✅ papel real vindo do Perfil (/perfis/meu-perfil)
  const [papel, setPapel] = useState<Perfil["papel"] | null>(null);

  const [mounted, setMounted] = useState(false);

  // Busca
  const [searchTerm, setSearchTerm] = useState("");

  // UI states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("gamelog_token");
    if (token) {
      setIsAuth(true);

      perfilService
        .getMeuPerfil()
        .then((perfil) => {
          if (perfil?.avatarImagem) setUserAvatar(perfil.avatarImagem);

          // ✅ aqui é o mais importante
          setPapel(perfil?.papel ?? null);
        })
        .catch((err) => {
          console.error(err);
          setPapel(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gamelog_token");
    localStorage.removeItem("gamelog_user");
    setIsAuth(false);
    setUserAvatar(null);
    setPapel(null); // ✅
    router.push("/login");
    router.refresh();
  };

  // ✅ Admin só se papel for ADMINISTRADOR
  const isAdmin = useMemo(() => {
    if (!mounted || !isAuth) return false;
    return papel === "ADMINISTRADOR";
  }, [mounted, isAuth, papel]);

  const goToSearch = (term: string) => {
    const q = term.trim();
    router.push(`/busca?q=${encodeURIComponent(q)}`);
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    goToSearch(searchTerm);
    setIsDrawerOpen(false);
  };

  // Fecha dropdown ao clicar fora / ESC
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isUserMenuOpen]);

  // Bloqueia scroll do body quando drawer abre
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, mounted]);

  if (!mounted) return <div className="h-20 bg-[#0D1117]" />;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0D1117]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-white hover:text-[#E839C2] transition-colors"
          >
            👾 GameLog
          </Link>

          {/* Busca (Desktop) */}
          <form onSubmit={onSubmitSearch} className="hidden lg:flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar jogos..."
                className="w-full rounded-full border border-white/10 bg-white/5 px-10 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#E839C2]/70 focus:ring-2 focus:ring-[#E839C2]/20 transition"
              />
            </div>
          </form>

          {/* Ações (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link href="/biblioteca" className="rounded-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/5 transition">
              Biblioteca
            </Link>

            <Link href="/listas" className="rounded-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/5 transition">
              Listas
            </Link>

            {/* ✅ Admin somente ADMINISTRADOR */}
            {isAuth && isAdmin && (
              <>
                <Link href="/admin" className="rounded-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/5 transition">
                  Admin
                </Link>
                <Link href="/sandbox" className="rounded-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/5 transition">
                  Sandbox
                </Link>
              </>
            )}

            {!isAuth ? (
              <>
                <Link href="/login" className="rounded-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/5 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#E839C2] border border-[#E839C2]/50 hover:border-[#E839C2] hover:bg-[#E839C2]/10 transition"
                >
                  Cadastrar
                </Link>
              </>
            ) : (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="h-10 w-10 min-w-10 aspect-square p-0 leading-none !rounded-full !overflow-hidden border border-[#E839C2]/60 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  title="Menu do usuário"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt="Perfil" className="block h-full w-full !rounded-full object-cover" />
                  ) : (
                    <span className="text-[#E839C2]">
                      <DefaultAvatar />
                    </span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1117]/95 backdrop-blur-md shadow-2xl"
                    role="menu"
                  >
                    <Link
                      href="/perfil"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/5 transition"
                      role="menuitem"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/configuracoes"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/5 transition"
                      role="menuitem"
                    >
                      Configurações
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/5 transition"
                      role="menuitem"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile: botão hamburger */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-full p-2 text-white/90 hover:bg-white/5 transition"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer Mobile */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Fechar menu"
          />

          <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm border-l border-white/10 bg-[#0D1117]/95 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between px-5 h-20 border-b border-white/10">
              <span className="text-white font-semibold">Menu</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-full p-2 text-white/90 hover:bg-white/5 transition"
                aria-label="Fechar"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Busca (Mobile) */}
              <form onSubmit={onSubmitSearch}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/50">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </span>

                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar jogos..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#E839C2]/70 focus:ring-2 focus:ring-[#E839C2]/20 transition"
                  />
                </div>
              </form>

              {/* Links */}
              <div className="space-y-2">
                <Link
                  href="/biblioteca"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                >
                  Biblioteca
                </Link>
                <Link
                  href="/listas"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                >
                  Listas
                </Link>

                {/* ✅ Admin somente ADMINISTRADOR */}
                {isAuth && isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                    >
                      Admin
                    </Link>
                    <Link
                      href="/sandbox"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                    >
                      Sandbox
                    </Link>
                  </>
                )}
              </div>

              {/* Sessão usuário */}
              <div className="border-t border-white/10 pt-4">
                {!isAuth ? (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-[#E839C2] border border-[#E839C2]/50 hover:border-[#E839C2] hover:bg-[#E839C2]/10 transition"
                    >
                      Cadastrar
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-2">
                      <div className="h-10 w-10 overflow-hidden rounded-full border border-[#E839C2]/60 bg-white/5 flex items-center justify-center">
                        {userAvatar ? (
                          <img src={userAvatar} alt="Perfil" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[#E839C2]">
                            <DefaultAvatar />
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-white/80">Conta</span>
                    </div>

                    <Link
                      href="/perfil"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                    >
                      Meu Perfil
                    </Link>

                    <Link
                      href="/configuracoes"
                      onClick={() => setIsDrawerOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                    >
                      Configurações
                    </Link>

                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="h-20" />
    </>
  );
}

export default Navbar;
