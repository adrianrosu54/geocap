import { getCaptures, postCapture } from '#/api/captures'
import { CaptureSchema } from '#/api/schemas'
import { queryClient } from '#/lib/queryClient'
import { useMutation, useQuery } from '@tanstack/react-query'
import z from 'zod'

export const useCaptures = () =>
  useQuery({
    queryKey: ['captures'],
    queryFn: async () => z.array(CaptureSchema).parse(await getCaptures()),
  })

export const useCreateCapture = () =>
  useMutation({
    mutationFn: async (formData: FormData) =>
      CaptureSchema.parse(await postCapture(formData)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['captures'] }),
  })
