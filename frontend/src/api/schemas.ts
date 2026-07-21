import z from 'zod'

// token

export const TokenSchema = z.object({
  access_token: z.jwt(),
  token_type: z.literal('Bearer'),
})

export type Token = z.infer<typeof TokenSchema>

export const JWTSchema = z.object({
  sub: z.string(),
  exp: z.string(),
  username: z.string(),
})

export type JWTType = z.infer<typeof JWTSchema>

// main entities

export const UserSchema = z.object({
  id: z.uuidv4(),
  username: z.string(),
  created_at: z.iso.datetime(),
})

export type User = z.infer<typeof UserSchema>

export const CaptureSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
  description: z.string(),
  id: z.uuidv4(),
  user_id: z.uuidv4(),
  image_path: z.string(),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    error: 'Invalid date string',
  }),
})

export type Capture = z.infer<typeof CaptureSchema>

// forms

export const LoginFormSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(8, 'At least 8 characters'),
})

export type LoginFormTypes = z.infer<typeof LoginFormSchema>

export const UploadFormSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
  description: z.string(),
  image_file: z
    .file()
    .mime(
      ['image/png', 'image/jpeg', 'image/webp'],
      'PNG, JPEG and WebP formats accepted',
    )
    .refine((f) => f.size < 10_485_000, 'Max file upload 10 MB'),
})

export type UploadFormTypes = z.infer<typeof UploadFormSchema>
