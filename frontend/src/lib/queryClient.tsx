import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 100,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
