// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/admin', '/perfil']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // No Next.js, a autenticação deve usar Cookies para o Middleware funcionar.
  // Você precisará ajustar seu Login.tsx para salvar o token como um cookie.
  const token = request.cookies.get('gamelog_token')?.value
  
  if (PROTECTED_ROUTES.includes(pathname) && !token) {
    const url = new URL('/login', request.url)
    // Redireciona usuários não autenticados para a tela de login
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  // Roda o middleware em todas as rotas, exceto estáticos e APIs internas.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], 
}