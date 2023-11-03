// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Next imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'

// ** Firebase Imports
import { db } from 'src/configs/firebase'
import { collection, query, where, doc, updateDoc, onSnapshot, orderBy } from 'firebase/firestore'

const AvailableTask = ({ user }) => {
  // ** State
  const [showList, setShowList] = useState(false)
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const tasksRef = collection(db, 'ClientSubTasks')
    const q = query(tasksRef, where('taskAvailable', '==', true), orderBy('key', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const fetchedTasks = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        })
        console.log('Fetch data:', fetchedTasks)
        setTasks(fetchedTasks)
        console.log(fetchedTasks)
      },
      error => {
        console.error('Error fetching tasks:', error)
      }
    )

    return unsubscribe
  }, [])

  const handleShowList = () => setShowList(!showList)
  const handleClickOpen = task => {
    setSelectedTask(task)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedTask(null)
  }

  return (
    <Fragment>
      <Button variant='outlined' onClick={handleShowList}>
        Show Tasks
      </Button>
      {showList && (
        <List>
          {tasks &&
            tasks.slice().map((task, i) => (
              <ListItem key={i}>
                <Card elevation={24} sx={{ maxWidth: 345, width: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant='body2' color='text.secondary'>
                        {' '}
                        <strong>Description: </strong> {task.description}
                      </Typography>

                      <Box mt={2}>
                        <Button
                          variant='outlined'
                          onClick={event => {
                            event.stopPropagation()
                            handleClickOpen(task)
                          }}
                        >
                          Accept Task
                        </Button>
                      </Box>
                      <Dialog
                        open={open}
                        disableEscapeKeyDown
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='alert-dialog-description'
                        onClose={(event, reason) => {
                          if (reason !== 'backdropClick') {
                            handleClose()
                          }
                        }}
                      >
                        <DialogTitle id='alert-dialog-title'>
                          {selectedTask ? selectedTask.description : ''}
                        </DialogTitle>

                        <DialogActions className='dialog-actions-dense'>
                          <Button
                            onClick={event => {
                              event.stopPropagation()
                              handleClose()
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async event => {
                              event.stopPropagation()
                              handleClose()

                              const taskRef = doc(db, 'ClientSubTasks', selectedTask.id)
                              await updateDoc(taskRef, {
                                taskAvailable: false,
                                employeeId: user.uid,
                                taskOngoingEmployee: true,
                                taskOngoingClient: true
                              })
                            }}
                          >
                            Accept
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Stack>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
        </List>
      )}
    </Fragment>
  )
}

export default AvailableTask
