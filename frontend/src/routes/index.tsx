import { Link, createFileRoute } from '@tanstack/react-router'

import { useAuthStore } from '#/stores/authStore'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.token))

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-blue-600">
            Open source, made for self-hosting
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Capture in the moment
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            GeoCap lets you save photos with their location alongside a
            description, so your memories stay connected to the places that made
            them meaningful.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              to={isAuthenticated ? '/dash' : '/register'}
            >
              {isAuthenticated ? 'View your captures' : 'Create an account'}
            </Link>
            <Link
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              to={isAuthenticated ? '/captures/new' : '/login'}
            >
              {isAuthenticated ? 'Add a capture' : 'Log in'}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <Feature
            title="Snap pictures from anywhere"
            description="Use your browser camera or choose an image, then save it with the location your device reports."
          />
          <Feature
            title="Keep your context"
            description="Add capture descriptions and keep coordinates alongside every image."
          />
          <Feature
            title="Own your memories"
            description="GeoCap is designed to be self-hosted, meaning you control your photos and data."
          />
        </div>
      </section>
    </main>
  )
}

function Feature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}
