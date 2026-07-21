import { createFileRoute } from '@tanstack/react-router'

import { LoginPopup } from '#/component/LoginPopup'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <LoginPopup popUpType="login" />
    </main>
  )
}
