import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { login, register } from './api/auth'
import { useAuthStore } from './stores/authStore'
import { getCapture, getCaptures } from './api/captures'
import { StrictMode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

declare global {
  interface Window {
    __api: {
      login: typeof login
      register: typeof register
      getCapture: typeof getCapture
      getCaptures: typeof getCaptures
    }
    __auth: {
      useAuthStore: typeof useAuthStore
    }
  }
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

if (import.meta.env.DEV) {
  window.__api = { register, login, getCaptures, getCapture }
  window.__auth = { useAuthStore }
}
