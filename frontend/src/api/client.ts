type FetchOptions = RequestInit & { skipAuth?: boolean }

export async function apiClient(path: String, options: FetchOptions = {}) {
  const { skipAuth, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers)

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`)
  }

  if (res.status === 204) return null

  return res.json()
}

export function formBody(data: Record<string, string>) {
  return {
    body: new URLSearchParams(data),
    Headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }
}
