export function getCaptureImageUrl(imagePath: string) {
  const path = imagePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
  return `${import.meta.env.VITE_API_URL}/api/uploads/${path}`
}

export function formatCaptureDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}
