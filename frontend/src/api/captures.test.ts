import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { postCapture } from './captures'
import { server } from '#/test/server'
import { useAuthStore } from '#/stores/authStore'

const API_URL = import.meta.env.VITE_API_URL

describe('postCapture', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends authenticated capture metadata and image as multipart form data', async () => {
    vi.spyOn(useAuthStore, 'getState').mockReturnValue({
      token: 'test-token',
      id: null,
      username: null,
      setSession: vi.fn(),
      logout: vi.fn(),
    })

    let receivedContentType = ''
    let receivedBody = ''

    server.use(
      http.post(`${API_URL}/api/captures`, async ({ request }) => {
        receivedContentType = request.headers.get('Content-Type') ?? ''
        receivedBody = await request.text()

        return HttpResponse.json({ ok: true })
      }),
    )

    const formData = new FormData()
    formData.append('latitude', '45')
    formData.append('longitude', '45')
    formData.append('accuracy', '12')
    formData.append('description', 'A city capture')
    formData.append('image_file', 'image contents')

    await postCapture(formData)

    expect(receivedContentType).toContain('multipart/form-data')
    expect(receivedBody).toContain('name="latitude"')
    expect(receivedBody).toContain('45')
    expect(receivedBody).toContain('name="longitude"')
    expect(receivedBody).toContain('45')
    expect(receivedBody).toContain('name="accuracy"')
    expect(receivedBody).toContain('12')
    expect(receivedBody).toContain('name="description"')
    expect(receivedBody).toContain('A city capture')
    expect(receivedBody).toContain('name="image_file"')
  })
})
