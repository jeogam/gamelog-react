import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Se você tiver lógica de proteção aqui que busca cookies,
  // ela vai falhar com localStorage.
  
  // Por enquanto, vamos permitir o acesso e deixar o Frontend proteger
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo favicon)
     * - admin (ADICIONADO: Ignorar admin para deixar o ProtectedRoute cuidar)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
}