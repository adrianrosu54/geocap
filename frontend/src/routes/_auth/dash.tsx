import { createFileRoute } from '@tanstack/react-router'

import { useCaptures } from '#/hooks/useCaptures'

export const Route = createFileRoute('/_auth/dash')({
  component: Dashboard,
})

function Dashboard() {
  const { data: captures, error, isLoading } = useCaptures()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">GeoCap</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Captures
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your saved photos and their locations.
          </p>
        </header>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-sm font-medium text-slate-700">
              {isLoading
                ? 'Loading captures…'
                : `${captures?.length ?? 0} captures`}
            </p>
          </div>

          {isLoading && <LoadingState />}

          {!isLoading && error && (
            <p className="px-5 py-8 text-sm text-red-700">
              Could not load captures. {error.message}
            </p>
          )}

          {!isLoading && !error && captures?.length === 0 && (
            <p className="px-5 py-8 text-sm text-slate-500">No captures yet.</p>
          )}

          {!isLoading && !error && captures && captures.length > 0 && (
            <div className="divide-y divide-slate-200">
              {captures.map((capture) => (
                <article
                  className="grid gap-4 px-5 py-4 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                  key={capture.id}
                >
                  <img
                    className="h-20 w-20 rounded-md bg-slate-100 object-cover"
                    src={getImageUrl(capture.image_path)}
                    alt={capture.description || 'Capture'}
                  />

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-medium text-slate-900">
                      {capture.description || 'Untitled capture'}
                    </h2>
                    <dl className="mt-2 grid gap-x-6 gap-y-1 text-xs text-slate-500 sm:grid-cols-2">
                      <div>
                        <dt className="inline font-medium text-slate-600">
                          Location:{' '}
                        </dt>
                        <dd className="inline">
                          {capture.latitude.toFixed(5)},{' '}
                          {capture.longitude.toFixed(5)}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-medium text-slate-600">
                          Accuracy:{' '}
                        </dt>
                        <dd className="inline">
                          {`${Math.round(capture.accuracy)} m`}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <time
                    className="text-xs text-slate-400 sm:self-start"
                    dateTime={capture.created_at}
                  >
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                    }).format(new Date(capture.created_at))}
                  </time>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function LoadingState() {
  return (
    <div className="divide-y divide-slate-200" aria-label="Loading captures">
      {[1, 2, 3].map((item) => (
        <div className="flex animate-pulse gap-4 px-5 py-4" key={item}>
          <div className="h-20 w-20 rounded-md bg-slate-200" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 w-2/5 rounded bg-slate-200" />
            <div className="h-3 w-3/5 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

function getImageUrl(imagePath: string) {
  const path = imagePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
  return `${import.meta.env.VITE_API_URL}/api/uploads/${path}`
}
