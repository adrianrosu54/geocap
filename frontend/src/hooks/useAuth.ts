import { login } from '#/api/auth'
import { JWTSchema, TokenSchema, type LoginFormTypes } from '#/api/schemas'
import { useAuthStore } from '#/stores/authStore'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { jwtDecode } from 'jwt-decode'

export const useAuth = () => {
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (loginFormData: LoginFormTypes) => {
      const token = await login(loginFormData)
      const access_token = TokenSchema.parse(token).access_token
      const jwt = JWTSchema.parse(jwtDecode(access_token))
      return { access_token, jwt }
    },
    onSuccess: (data) => {
      setSession(data.access_token, data.jwt)
    },
  })
}
