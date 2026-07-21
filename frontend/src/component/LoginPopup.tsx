import { register } from '#/api/auth'
import { LoginFormSchema, type LoginFormTypes } from '#/api/schemas'
import { useAuth } from '#/hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export const LoginPopup = ({
  popUpType,
}: {
  popUpType: 'login' | 'signup'
}) => {
  const navigate = useNavigate()
  const auth =
    popUpType === 'login'
      ? useAuth()
      : useMutation({
          mutationFn: register,
          onSuccess: () => void navigate({ to: '/login' }),
        })

  const form = useForm<LoginFormTypes>({
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = (values: LoginFormTypes) => {
    const result = LoginFormSchema.safeParse(values)
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field === 'username' || field === 'password') {
          form.setError(field, { message: issue.message })
        }
      }
      return
    }

    auth.mutate(result.data)
  }

  return (
    <section className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-600">GeoCap</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {popUpType === 'login' ? 'Log in' : 'Sign Up'}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to view and create captures.
        </p>
      </div>

      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block text-sm font-medium text-slate-700">
          Username
          <input
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            autoComplete="username"
            {...form.register('username', { required: 'Required' })}
          />
          {form.formState.errors.username && (
            <span className="mt-1 block text-xs text-red-600">
              {form.formState.errors.username.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            type="password"
            autoComplete={
              popUpType === 'login' ? 'current-password' : 'new-password'
            }
            {...form.register('password', {
              required: 'Required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
          {form.formState.errors.password && (
            <span className="mt-1 block text-xs text-red-600">
              {form.formState.errors.password.message}
            </span>
          )}
        </label>

        {auth.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {auth.error.message}
          </p>
        )}

        <button
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={auth.isPending}
        >
          {popUpType === 'login'
            ? auth.isPending
              ? 'Logging in…'
              : 'Log in'
            : auth.isPending
              ? 'Creating account…'
              : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {popUpType === 'login' ? (
          <>
            No account?{' '}
            <Link
              className="font-medium text-blue-600 hover:text-blue-700"
              to="/register"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              className="font-medium text-blue-600 hover:text-blue-700"
              to="/login"
            >
              Log in
            </Link>
          </>
        )}
      </p>
    </section>
  )
}
