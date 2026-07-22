import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useCapture, useUpdateCaptureDescription } from '#/hooks/useCaptures'
import { formatCaptureDate, getCaptureImageUrl } from '#/lib/capture'

export const Route = createFileRoute('/_auth/captures/$id')({
  component: CaptureDetailPage,
})

function CaptureDetailPage() {
  const { id } = Route.useParams()
  const { data: capture, error, isLoading } = useCapture(id)
  const updateMutation = useUpdateCaptureDescription()
  const [isEditing, setIsEditing] = useState(false)
  const form = useForm<DescriptionForm>({ defaultValues: { description: '' } })

  useEffect(() => {
    if (capture && !isEditing) {
      form.reset({ description: capture.description })
    }
  }, [capture, form, isEditing])

  const onSubmit = (values: DescriptionForm) => {
    if (!capture) return

    updateMutation.mutate(
      { capture, description: values.description.trim() },
      { onSuccess: () => setIsEditing(false) },
    )
  }

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
                {isEditing ? (
                  <form
                    className="mt-2 space-y-3"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <textarea
                      className="block min-h-24 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoFocus
                      {...form.register('description')}
                    />
                    {updateMutation.error && (
                      <p className="text-sm text-red-700">
                        Could not update description.{' '}
                        {updateMutation.error.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        disabled={updateMutation.isPending}
                        type="submit"
                      >
                        {updateMutation.isPending ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        type="button"
                        onClick={() => {
                          form.reset({ description: capture.description })
                          updateMutation.reset()
                          setIsEditing(false)
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <p className="text-base text-slate-800">
                      {capture.description || 'No description provided.'}
                    </p>
                    <button
                      className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </div>
                )}
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

type DescriptionForm = { description: string }

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
