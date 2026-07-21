import { useAuthStore } from '#/stores/authStore'

type FetchOptions = RequestInit & { skipAuth?: boolean }

export async function apiClient(path: string, options: FetchOptions = {}) {
  const { skipAuth, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers)

  let res: Response

  if (!skipAuth) {
    const token = useAuthStore.getState().token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    else throw new Error('Unauthorized. Make sure to log in')
  }

  try {
    res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      ...fetchOptions,
      headers,
    })
  } catch (error) {
    throw new Error('Network error. check server connectivity')
  }

  if (res.status === 401) {
    useAuthStore.getState().logout()
    throw new Error('Token has expired')
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed (status ${res.status}): ${text}`)
  }

  if (res.status === 204) return null

  return res.json()
}

export function formBody(data: Record<string, string>) {
  return {
    body: new URLSearchParams(data),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }
}
