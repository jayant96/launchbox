import { useRouter } from 'next/router'
import React from 'react'
import SubTaskPage from 'src/views/SubTaskPage'

export default function subTask() {
  const router = useRouter()
  const { subTaskId } = router.query

  console.log('TaskId from pages.js:', subTaskId)

  if (!router.isReady) {
    return <div>Loading...</div> // Loading spinner or placeholder
  }

  // Check if taskId is available
  if (!subTaskId) {
    return <div>Error: Task not found</div> // Handle the error appropriately
  }

  return <SubTaskPage taskId={subTaskId} />
}
