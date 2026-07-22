export type LocationState =
  | {
      status: 'loading'
      latitude: null
      longitude: null
      accuracy: null
      error: null
    }
  | {
      status: 'ready'
      latitude: number
      longitude: number
      accuracy: number
      error: null
    }
  | {
      status: 'error'
      latitude: null
      longitude: null
      accuracy: null
      error: string
    }

export function LocationPanel({
  location,
  onRetry,
}: {
  location: LocationState
  onRetry: () => void
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-slate-800">
            Capture location
          </h2>
          {location.status === 'loading' && (
            <p className="mt-1 text-sm text-slate-500">
              Requesting your location…
            </p>
          )}
          {location.status === 'error' && (
            <p className="mt-1 text-sm text-red-600">{location.error}</p>
          )}
          {location.status === 'ready' && (
            <dl className="mt-2 space-y-1 text-sm text-slate-600">
              <div>
                <dt className="inline font-medium">Coordinates: </dt>
                <dd className="inline">
                  {location.latitude.toFixed(5)},{' '}
                  {location.longitude.toFixed(5)}
                </dd>
              </div>
              <div>
                <dt className="inline font-medium">Accuracy: </dt>
                <dd className="inline">{Math.round(location.accuracy)} m</dd>
              </div>
            </dl>
          )}
        </div>
        {location.status !== 'ready' && (
          <button
            className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
            type="button"
            onClick={onRetry}
          >
            {location.status === 'loading' ? 'Retry' : 'Try again'}
          </button>
        )}
      </div>
    </div>
  )
}
