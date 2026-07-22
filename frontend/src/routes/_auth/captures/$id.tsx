import { Link, createFileRoute } from '@tanstack/react-router'

import { useCapture } from '#/hooks/useCaptures'
import { formatCaptureDate, getCaptureImageUrl } from '#/lib/capture'

export const Route = createFileRoute('/_auth/captures/$id')({
  component: CaptureDetailPage,
})

function CaptureDetailPage() {
  const { id } = Route.useParams()
  const { data: capture, error, isLoading } = useCapture(id)

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            className="text-sm text-slate-500 hover:text-slate-700"
            to="/dash"
          >
            ← Back to captures
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">
            Capture details
          </h1>
        </div>

        {isLoading && <LoadingState />}

        {!isLoading && error && (
          <section className="rounded-xl bg-white px-5 py-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-red-700">
              Could not load this capture. {error.message}
            </p>
          </section>
        )}

        {!isLoading && !error && capture && (
          <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="bg-slate-100 p-4 sm:p-8">
              <img
                className="mx-auto max-h-[70vh] w-full object-contain"
                src={getCaptureImageUrl(capture.image_path)}
                alt={capture.description || 'Capture'}
              />
            </div>

            <div className="space-y-6 p-5 sm:p-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Description
                </p>
                <p className="mt-2 text-base text-slate-800">
                  {capture.description || 'No description provided.'}
                </p>
              </div>

              <dl className="grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
                <MetadataItem
                  label="Latitude"
                  value={capture.latitude.toFixed(6)}
                />
                <MetadataItem
                  label="Longitude"
                  value={capture.longitude.toFixed(6)}
                />
                <MetadataItem
                  label="Location accuracy"
                  value={`${Math.round(capture.accuracy)} m`}
                />
                <MetadataItem
                  label="Captured"
                  value={formatCaptureDate(capture.created_at)}
                />
                <MetadataItem label="Capture ID" value={capture.id} />
              </dl>
            </div>
          </article>
        )}
      </div>
    </main>
  )
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-all text-sm text-slate-700">{value}</dd>
    </div>
  )
}

function LoadingState() {
  return (
    <section
      className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
      aria-label="Loading capture"
    >
      <div className="h-[55vh] bg-slate-200" />
      <div className="space-y-4 p-8">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
      </div>
    </section>
  )
}
