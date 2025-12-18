// src/components/ProtectedRoute.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[] // Ex: ['ADMINISTRADOR']
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // 1. Verifica se tem token
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    // 2. Verifica o papel (Role)
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = authService.getRole()
      
      // Se o papel do usuário não estiver na lista de permitidos
      if (!userRole || !allowedRoles.includes(userRole)) {
        alert("Acesso Negado: Você não tem permissão para acessar esta página.")
        router.push('/') // Manda para Home se não for admin
        return
      }
    }

    // Se passou, autoriza
    setIsAuthorized(true)
  }, [router, allowedRoles])

  // Enquanto verifica, não mostra nada (ou poderia mostrar um Loading...)
  if (!isAuthorized) {
    return null 
  }

  return <>{children}</>
}

export default ProtectedRoute