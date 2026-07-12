import { server } from '#/test/server'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { login, register } from './auth'
import { v4 } from 'uuid'

const API_URL = import.meta.env.VITE_API_URL

const exampleLogin = { username: 'johndoe', password: 'secretpass' }
const exampleUser = {
  username: exampleLogin.username,
  id: v4(),
  created_at: new Date().toISOString(),
}

describe('register', () => {
  it('sends credentials and returns created user data', async () => {
    let receivedBody = ''
    let receivedContentType = ''

    server.use(
      http.post(`${API_URL}/api/auth/register`, async ({ request }) => {
        receivedContentType = request.headers.get('Content-Type') ?? ''
        receivedBody = await request.text()
        return HttpResponse.json(exampleUser)
      }),
    )

    const result = await register(exampleLogin)

    expect(receivedContentType).toContain('application/x-www-form-urlencoded')
    expect(receivedBody).toBe(
      `username=${exampleLogin.username}&password=${exampleLogin.password}`,
    )
    expect(result).toEqual(exampleUser)
  })
})

describe('login', () => {
  it('sends user credential form and returns the token response', async () => {
    let receivedBody = ''
    let receivedContentType = ''

    server.use(
      http.post(`${API_URL}/api/auth/login`, async ({ request }) => {
        receivedContentType = request.headers.get('Content-Type') ?? ''
        receivedBody = await request.text()
        return HttpResponse.json({
          access_token: 'abc123',
          token_type: 'Bearer',
        })
      }),
    )

    const result = await login(exampleLogin)

    expect(receivedContentType).toContain('application/x-www-form-urlencoded')
    expect(receivedBody).toBe('username=johndoe&password=secretpass')
    expect(result).toEqual({ access_token: 'abc123', token_type: 'Bearer' })
  })

  it('throw when server rejects credentials', async () => {
    server.use(
      http.post(`${API_URL}/api/auth/login`, () =>
        HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 }),
      ),
    )

    await expect(login(exampleLogin)).rejects.toThrow()
  })
})
