import React, { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { TabList, TabPanel, TabContext } from '@mui/lab'

import SendIcon from '@mui/icons-material/Send'
import InputAdornment from '@mui/material/InputAdornment'
import UploadFile from 'src/views/components/Other/Uploadfile'
import ReviewTaskForm from 'src/views/TaskReview/ReviewTaskForm'

// ** Firebase imports
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, updateDoc } from 'firebase/firestore'
import { db } from 'src/configs/firebase'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TaskPage = ({ taskId }) => {
  const { user } = useAuth()
  const theme = useTheme()
  const router = useRouter()

  const [task, setTask] = useState(null)
  const [clientData, setClientData] = useState(null)
  const [value, setValue] = useState('1')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [employeeComment, setEmployeeComment] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const [reviewSubmissionDialogOpen, setReviewSubmissionDialogOpen] = useState(false)
  const [clientComment, setClientComment] = useState('')
  const [showReviewClient, setShowReviewClient] = useState(false)
  const [showReviewEmployee, setShowReviewEmployee] = useState(false)

  useEffect(() => {
    const taskRef = doc(db, 'ClientSubTasks', taskId)

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(taskRef, snapshot => {
      if (snapshot.exists()) {
        console.log('Document data:', snapshot.data())
        setTask(snapshot.data())
      } else {
        console.log('No such document!')
      }
    })

    // Clean up the subscription when the component is unmounted
    return () => unsubscribe()
  }, [taskId])

  useEffect(() => {
    const fetchClientData = async () => {
      if (task) {
        const docRef = doc(db, 'users', task.clientId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          console.log('Client Data:', docSnap.data())
          setClientData(docSnap.data())
        } else {
          console.log('No such client!')
        }
      }
    }

    fetchClientData()
  }, [task])

  useEffect(() => {
    // Here, we point to the `chats` subcollection of the specific task
    const chatQuery = collection(db, 'ClientSubTasks', taskId, 'chats')

    const unsubscribe = onSnapshot(chatQuery, snapshot => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(newMessages)
    })

    return unsubscribe
  }, [taskId])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (newMessage.trim() === '') return

    const senderRole = user.role

    // Here, we add a new chat message to the `chats` subcollection of the specific task
    await addDoc(collection(db, 'ClientSubTasks', taskId, 'chats'), {
      senderId: user.uid,
      message: newMessage,
      senderRole,
      timestamp: Date.now()
    })

    setNewMessage('')
  }

  const handleSnackClick = () => {
    setSnackOpen(true)
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'timeout') {
      return
    }
    setSnackOpen(false)
  }

  const handleFileUpload = async () => {
    if (file) {
      const downloadURL = await UploadFile(file)

      // Update the tasks collection with the comment and storage URL
      const taskRef = doc(db, 'ClientSubTasks', taskId)
      await updateDoc(taskRef, {
        commentEmployee: employeeComment,
        taskStorage: downloadURL,
        submitForReview: true
      })

      setFileUploadDialogOpen(false)
    }
  }

  const handleChanges = async () => {
    const taskRef = doc(db, 'ClientSubTasks', taskId)
    await updateDoc(taskRef, {
      submitForReview: false,
      commentClient: clientComment
    })

    setReviewSubmissionDialogOpen(false)
  }

  const handleAccept = async () => {
    const taskRef = doc(db, 'ClientSubTasks', taskId)
    await updateDoc(taskRef, {
      submitForReview: false,
      reviewCompleted: true,
      commentClient: clientComment
    })

    setReviewSubmissionDialogOpen(false)
  }

  const handleTaskAccept = async () => {
    setShowReviewClient(true)
    const taskRef = doc(db, 'ClientSubTasks', taskId)
    await updateDoc(taskRef, {
      taskCompletedEmployee: true,
      taskCompletedClient: true,
      taskOngoingClient: false,
      taskOngoingEmployee: false
    })

    if (task.reviewClient) {
      router.push('/home')
    }
  }

  const handleShowReviewClient = () => {
    setShowReviewClient(false)
    setShowReviewEmployee(true)
  }

  const handleShowReviewEmployeeClose = () => {
    setShowReviewEmployee(false)
    if (task.reviewEmployee) {
      router.push('/home')
    }
  }

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={5}>
          <TabContext value={value}>
            <TabList onChange={handleChange}>
              <Tab value='1' label='Task Description' />
              <Tab value='2' label='Client Description' />
            </TabList>
            <TabPanel value='1'>
              {task && (
                <Stack spacing={2}>
                  {user && user.role && user.role == 'Client' && (
                    <Fragment>
                      <Typography variant='h5'>Name: {task.mainTaskName}</Typography>
                      {/* <Typography variant='h5'>Budget: {task.budget}</Typography> */}
                    </Fragment>
                  )}
                  <Typography variant='h5'>Description: {task.description}</Typography>
                </Stack>
              )}
            </TabPanel>
            <TabPanel value='2'>
              {clientData && (
                <Stack spacing={2}>
                  <Typography variant='h5'>Name: {clientData.fullname}</Typography>
                  <Typography variant='h5'>Username: {clientData.username}</Typography>
                  <Typography variant='h5'>Email: {clientData.email}</Typography>
                </Stack>
              )}
            </TabPanel>
          </TabContext>
        </Grid>
        <Grid item xs={1}>
          <Divider orientation='vertical' flexItem />
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h3'>Chat</Typography>
          <Box display='flex' flexDirection='column' sx={{ height: '450px', overflowY: 'auto' }}>
            {messages
              .sort((a, b) => a.timestamp - b.timestamp)
              .map(message => (
                <Box
                  key={message.id}
                  display='flex'
                  alignItems='center'
                  p={1}
                  mb={2}
                  style={{
                    maxWidth: '100%',
                    alignSelf: message.senderId === user.uid ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Tooltip title={message.senderId === user.uid ? 'You' : message.senderRole}>
                    <Avatar>{message.senderId === user.uid ? 'U' : message.senderRole[0].toUpperCase()}</Avatar>
                  </Tooltip>
                  <Box
                    ml={1}
                    p={1}
                    bgcolor={message.senderId === user.uid ? theme.palette.primary.light : theme.palette.primary.dark}
                    borderRadius={1}
                  >
                    <Typography
                      variant='subtitle2'
                      style={{
                        color:
                          message.senderId === user.uid
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText
                      }}
                    >
                      {message.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
          </Box>
          <Box mt={4}>
            <form onSubmit={handleSubmit}>
              <TextField
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder='Type a message'
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleSubmit}>
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        {user &&
          task &&
          user.role &&
          user.role === 'Employee' &&
          task.submitForReview == false &&
          task.reviewCompleted == false && (
            <Fragment>
              <Button variant='outlined' onClick={() => setFileUploadDialogOpen(true)}>
                Submit for review
              </Button>
              <Dialog
                open={fileUploadDialogOpen}
                onClose={() => setFileUploadDialogOpen(false)}
                aria-labelledby='file-upload-dialog-title'
              >
                <DialogTitle id='file-upload-dialog-title'>Submit your review</DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ mb: 3 }}>
                    To upload a file, please select the file and add your comment.
                  </DialogContentText>
                  <Stack spacing={2}>
                    {task && task.commentClient && <Typography>Client's comment: {task.commentClient}</Typography>}
                    <TextField type='file' label='Select File' onChange={e => setFile(e.target.files[0])} />
                    <TextField
                      id='comment'
                      fullWidth
                      type='text'
                      label='Comment'
                      name='comment'
                      onChange={e => setEmployeeComment(e.target.value)}
                    />
                  </Stack>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                  <Button onClick={() => setFileUploadDialogOpen(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      handleFileUpload()
                      handleSnackClick()
                    }}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                open={snackOpen}
                message='Task Added Successfully!'
                autoHideDuration={3000}
                action={
                  <Fragment>
                    <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackClose}>
                      <Icon icon='mdi:close' fontSize={20} />
                    </IconButton>
                  </Fragment>
                }
              />
            </Fragment>
          )}
      </Grid>
      <Grid container>
        {user && task && user.role && user.role === 'Client' && task.submitForReview == true && (
          <Fragment>
            <Button variant='outlined' onClick={() => setReviewSubmissionDialogOpen(true)}>
              Review submission
            </Button>
            <Dialog
              open={reviewSubmissionDialogOpen}
              onClose={() => setReviewSubmissionDialogOpen(false)}
              aria-labelledby='review-submission-dialog-title'
            >
              <DialogTitle id='review-submission-dialog-title'>Review the Submission</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                  Please review the file and comment submitted by the employee, and provide your feedback.
                </DialogContentText>
                <Stack spacing={2}>
                  <a href={task.taskStorage} target='_blank' rel='noopener noreferrer'>
                    Download the file
                  </a>
                  <Typography>Employee's comment: {task.commentEmployee}</Typography>
                  <TextField
                    id='client-comment'
                    fullWidth
                    type='text'
                    label='Your Comment'
                    name='commentClient'
                    onChange={e => setClientComment(e.target.value)}
                  />
                </Stack>
              </DialogContent>
              <DialogActions className='dialog-actions-dense'>
                <Button onClick={() => setReviewSubmissionDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleChanges}>Changes</Button>
                <Button onClick={handleAccept}>Accept</Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        )}
      </Grid>
      <Grid container>
        {user &&
          task &&
          user.role &&
          user.role === 'Client' &&
          task.reviewCompleted == true &&
          task.reviewClient == false && (
            <Fragment>
              <Button variant='outlined' onClick={handleTaskAccept}>
                Accept Project
              </Button>
              <ReviewTaskForm taskId={taskId} open={showReviewClient} onClose={handleShowReviewClient} />
            </Fragment>
          )}
      </Grid>
      <Grid container>
        {user && task && user.role && user.role === 'Employee' && task.reviewCompleted == true && (
          <Fragment>
            <Typography>Task accept and completed!</Typography>
            <ReviewTaskForm taskId={taskId} open={showReviewEmployee} onClose={handleShowReviewEmployeeClose} />
          </Fragment>
        )}
      </Grid>
    </Fragment>
  )
}

export default TaskPage
