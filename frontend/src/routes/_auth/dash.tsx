import { useCaptures } from '#/hooks/useCaptures'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dash')({
  component: Dashboard,
})

function Dashboard() {
  const { data: captures, isLoading } = useCaptures()

  return <div></div>
}
