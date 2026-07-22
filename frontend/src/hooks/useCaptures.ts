import {
  deleteCapture,
  getCapture,
  getCaptures,
  postCapture,
  putCapture,
} from '#/api/captures'
import { CaptureSchema } from '#/api/schemas'
import type { Capture } from '#/api/schemas'
import { getCaptureImageUrl } from '#/lib/capture'
import { queryClient } from '#/lib/queryClient'
import { useMutation, useQuery } from '@tanstack/react-query'
import z from 'zod'

export const useCaptures = () =>
  useQuery({
    queryKey: ['captures'],
    queryFn: async () => z.array(CaptureSchema).parse(await getCaptures()),
  })

export const useCapture = (captureId: string) =>
  useQuery({
    queryKey: ['capture', captureId],
    queryFn: async () => CaptureSchema.parse(await getCapture(captureId)),
  })

export const useCreateCapture = () =>
  useMutation({
    mutationFn: async (formData: FormData) =>
      CaptureSchema.parse(await postCapture(formData)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['captures'] }),
  })

export const useDeleteCapture = () =>
  useMutation({
    mutationFn: (captureId: string) => deleteCapture(captureId),
    onSuccess: (_, captureId) => {
      queryClient.removeQueries({ queryKey: ['capture', captureId] })
      return queryClient.invalidateQueries({ queryKey: ['captures'] })
    },
  })

/**
 *  Note: This won't work for updating the actual capture picture, only metadata
 */
export const useUpdateCaptureDescription = () =>
  useMutation({
    mutationFn: async ({
      capture,
      description,
    }: {
      capture: Capture
      description: string
    }) => {
      const imageResponse = await fetch(getCaptureImageUrl(capture.image_path))
      if (!imageResponse.ok) {
        throw new Error('Could not read the current image for this update')
      }

      const imageBlob = await imageResponse.blob()
      const formData = new FormData()
      formData.append('latitude', String(capture.latitude))
      formData.append('longitude', String(capture.longitude))
      formData.append('accuracy', String(capture.accuracy))
      formData.append('description', description)
      formData.append(
        'image_file',
        new File([imageBlob], getCaptureFilename(capture.image_path), {
          type: imageBlob.type || 'image/jpeg',
        }),
      )

      return CaptureSchema.parse(await putCapture(capture.id, formData))
    },
    onSuccess: (capture) => {
      queryClient.setQueryData(['capture', capture.id], capture)
      return queryClient.invalidateQueries({ queryKey: ['captures'] })
    },
  })

function getCaptureFilename(imagePath: string) {
  return imagePath.split('/').pop() || 'capture.jpg'
}
