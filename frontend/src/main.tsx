import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { login, register } from './api/auth'
import { useAuthStore } from './stores/authStore'
import { getCapture, getCaptures } from './api/captures'

declare global {
  interface Window {
    __api: {
      login: typeof import('./api/auth').login
      register: typeof import('./api/auth').register
      getCapture: typeof import('./api/captures').getCapture
      getCaptures: typeof import('./api/captures').getCaptures
    }
    __auth: {
      useAuthStore: typeof import('./stores/authStore').useAuthStore
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
  root.render(<RouterProvider router={router} />)
}

if (import.meta.env.DEV) {
  window.__api = { register, login, getCaptures, getCapture }
  window.__auth = { useAuthStore }
}
