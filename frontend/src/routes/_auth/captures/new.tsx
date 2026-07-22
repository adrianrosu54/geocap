import { useCallback, useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { UploadFormSchema } from '#/api/schemas'
import { useCreateCapture } from '#/hooks/useCaptures'
import { LocationPanel } from '#/component/LocationPanel'
import type { LocationState } from '#/component/LocationPanel'

export const Route = createFileRoute('/_auth/captures/new')({
  component: NewCapturePage,
})

type DescriptionForm = { description: string }

function NewCapturePage() {
  const navigate = useNavigate()
  const createCapture = useCreateCapture()
  const [location, setLocation] = useState<LocationState>({
    status: 'loading',
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const form = useForm<DescriptionForm>({ defaultValues: { description: '' } })

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocation({
        status: 'error',
        latitude: null,
        longitude: null,
        accuracy: null,
        error: 'Geolocation is not available in this browser.',
      })
      return
    }

    setLocation({
      status: 'loading',
      latitude: null,
      longitude: null,
      accuracy: null,
      error: null,
    })

    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          status: 'ready',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
        }),
      (error) =>
        setLocation({
          status: 'error',
          latitude: null,
          longitude: null,
          accuracy: null,
          error: getLocationError(error.code),
        }),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  const onSubmit = (values: DescriptionForm) => {
    if (!selectedFile || location.status !== 'ready') return

    const result = UploadFormSchema.safeParse({
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      description: values.description,
      image_file: selectedFile,
    })

    if (!result.success) {
      const imageIssue = result.error.issues.find(
        (issue) => issue.path[0] === 'image_file',
      )
      setFileError(imageIssue?.message ?? 'Choose a valid image file.')
      return
    }

    setFileError(null)
    const formData = new FormData()
    formData.append('latitude', String(result.data.latitude))
    formData.append('longitude', String(result.data.longitude))
    formData.append('accuracy', String(result.data.accuracy))
    formData.append('description', result.data.description)
    formData.append('image_file', result.data.image_file)

    createCapture.mutate(formData, {
      onSuccess: () => void navigate({ to: '/dash' }),
    })
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            className="text-sm text-slate-500 hover:text-slate-700"
            to="/dash"
          >
            ← Back to captures
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">
            New capture
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose a photo and save it with your current location.
          </p>
        </div>

        <form
          className="space-y-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="image_file"
            >
              Image
            </label>
            <input
              className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700"
              id="image_file"
              accept="image/png,image/jpeg,image/webp"
              capture="environment"
              type="file"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] ?? null)
                setFileError(null)
              }}
            />
            <p className="mt-2 text-xs text-slate-500">
              PNG, JPEG, or WebP up to 10 MB.
            </p>
            {selectedFile && (
              <p className="mt-2 text-xs text-slate-600">{selectedFile.name}</p>
            )}
            {fileError && (
              <p className="mt-2 text-xs text-red-600">{fileError}</p>
            )}
            {previewUrl && (
              <img
                className="mt-4 max-h-72 w-full rounded-md bg-slate-100 object-contain"
                src={previewUrl}
                alt="Selected capture preview"
              />
            )}
          </div>

          <label
            className="block text-sm font-medium text-slate-700"
            htmlFor="description"
          >
            Description{' '}
            <span className="font-normal text-slate-400">(optional)</span>
            <textarea
              className="mt-2 block min-h-24 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="description"
              placeholder="What is this capture?"
              {...form.register('description')}
            />
          </label>

          <LocationPanel location={location} onRetry={requestLocation} />

          {createCapture.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {createCapture.error.message}
            </p>
          )}

          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={
              createCapture.isPending ||
              !selectedFile ||
              location.status !== 'ready'
            }
            type="submit"
          >
            {createCapture.isPending ? 'Saving capture…' : 'Save capture'}
          </button>
        </form>
      </div>
    </main>
  )
}

function getLocationError(code: number) {
  if (code === 1)
    return 'Location permission was denied. Enable it in your browser and try again.'
  if (code === 2) return 'Your location could not be determined. Try again.'
  if (code === 3) return 'Location request timed out. Try again.'
  return 'Unable to get your location. Try again.'
}
