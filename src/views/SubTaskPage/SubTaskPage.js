import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material'
import React, { Fragment, useState, useEffect } from 'react'

// ** Firebase imports
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from 'src/configs/firebase'

const SubTaskPage = ({ taskId }) => {
  const [task, setTask] = useState(null)
  const [subTasks, setSubTasks] = useState(null)
  const [editingKey, setEditingKey] = useState(null)
  const [newDescription, setNewDescription] = useState('')

  const handleEdit = (key, description) => {
    setEditingKey(key)
    setNewDescription(description)
  }

  const handleCancel = () => {
    setEditingKey(null)
    setNewDescription('')
  }

  const handleUpdate = async key => {
    try {
      const subTaskRef = doc(db, 'ClientSubTasks', key)
      await updateDoc(subTaskRef, { description: newDescription })
      console.log('SubTask updated')
      setEditingKey(null)
      setNewDescription('')
    } catch (error) {
      console.error('Error updating subtask:', error)
    }
  }

  useEffect(() => {
    console.log('Task Id:', taskId)
    const taskRef = doc(db, 'ClientTasks', taskId)

    const unsubscribe = onSnapshot(
      taskRef,
      snapshot => {
        if (snapshot.exists()) {
          console.log('Document data:', snapshot.data())
          setTask(snapshot.data())
        } else {
          console.log('No such document!')
        }
      },
      error => {
        console.error('Error fetching document:', error)
      }
    )

    // Clean up the subscription when the component is unmounted
    return () => unsubscribe()
  }, [taskId])

  useEffect(() => {
    // ... your existing code for fetching the task ...

    const subTasksRef = collection(db, 'ClientSubTasks')
    const q = query(subTasksRef, where('clientTaskId', '==', taskId), orderBy('key', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const fetchedSubTasks = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
        console.log('Fetch SubTasks:', fetchedSubTasks)
        setSubTasks(fetchedSubTasks)
      },
      error => {
        console.error('Error fetching subtasks:', error)
      }
    )

    // Clean up the subscription when the component is unmounted
    return () => unsubscribe()
  }, [taskId])

  return (
    <Fragment>
      <Typography variant='h2'>SubTask Page °.° </Typography>
      {task && (
        <Stack spacing={2}>
          <Typography variant='h4'>Main Task</Typography>
          <Typography>Task Name: {task.name}</Typography>
          <Typography>Description: {task.description}</Typography>
          <Typography>Duration: {task.duration}</Typography>
          <Typography>Budget: {task.budget}</Typography>
        </Stack>
      )}
      <Grid mt={2}>
        <Typography variant='h4'>Sub Tasks</Typography>
      </Grid>
      <Stack spacing={2}>
        {subTasks &&
          subTasks.map((subTask, index) => (
            <Box key={index}>
              {editingKey === subTask.key ? (
                <Grid container mt={2}>
                  <Grid item xs={10}>
                    <TextField fullWidth value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                  </Grid>
                  <Grid item xs={2}>
                    <Button onClick={() => handleUpdate(subTask.id)}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid container mt={2}>
                  <Grid item xs={10}>
                    <Typography>
                      {subTask.key}: {subTask.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button onClick={() => handleEdit(subTask.key, subTask.description)}>Edit</Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
      </Stack>
    </Fragment>
  )
}

export default SubTaskPage
