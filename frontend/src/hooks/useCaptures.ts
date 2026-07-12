import { getCaptures } from '#/api/captures'
import { CaptureSchema } from '#/api/schemas'
import { useQuery } from '@tanstack/react-query'
import z from 'zod'

export const useCaptures = () =>
  useQuery({
    queryKey: ['captures'],
    queryFn: async () => z.array(CaptureSchema).parse(await getCaptures()),
  })
