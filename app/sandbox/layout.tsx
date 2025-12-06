// app/sandbox/layout.tsx

import PasswordGate from '@/components/PasswordGate'

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // PasswordGate é um Client Component que faz a verificação local da senha.
    <PasswordGate>
      {children}
    </PasswordGate>
  )
}