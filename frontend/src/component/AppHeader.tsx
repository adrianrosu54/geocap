import { Link, useNavigate } from '@tanstack/react-router'

import { useAuthStore } from '#/stores/authStore'

export function AppHeader() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => Boolean(state.token))
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    void navigate({ to: '/' })
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="text-lg font-semibold text-slate-900" to="/">
          GeoCap
        </Link>

        <nav
          className="flex items-center gap-3 text-sm"
          aria-label="Main navigation"
        >
          {isAuthenticated ? (
            <>
              <Link
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                activeProps={{ className: 'bg-slate-100 text-slate-900' }}
                to="/dash"
              >
                Dashboard
              </Link>
              <Link
                className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                to="/captures/new"
              >
                New capture
              </Link>
              <button
                className="rounded-md px-2 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                type="button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                activeProps={{ className: 'bg-slate-100 text-slate-900' }}
                to="/login"
              >
                Log in
              </Link>
              <Link
                className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                to="/register"
              >
                Sign up to get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
