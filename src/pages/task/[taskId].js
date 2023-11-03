import { useRouter } from 'next/router'
import React from 'react'
import TaskPage from 'src/views/TaskPage'

export default function Task() {
  const router = useRouter()
  const { taskId } = router.query

  return <TaskPage taskId={taskId} />
}
