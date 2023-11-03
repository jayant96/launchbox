// ** React Imports
import { Fragment, useState } from 'react'
import axios from 'axios'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Firebase imports
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'
import { db } from 'src/configs/firebase'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AddTask = ({ user }) => {
  // ** State
  const [open, setOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [task, setTask] = useState({
    name: '',
    description: '',
    duration: '',
    budget: ''
  })

  const handleChange = e => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    })
  }
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleSnackClick = () => {
    setSnackOpen(true)
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'timeout') {
      return
    }
    setSnackOpen(false)
  }
  const handleSubmit = async () => {
    try {
      // Create a reference for a new clientTask, with auto-generated ID
      const clientTaskRef = doc(collection(db, 'ClientTasks'))

      // Set data for the clientTask using the reference
      await setDoc(clientTaskRef, {
        ...task,
        clientId: user.uid
      })

      const response = await axios.post('http://127.0.0.1:8000/create-subtasks', {
        main_task: task.description
      })

      // Log the response from your server
      console.log(response.data)

      for (const item in response.data) {
        const subTaskDescription = response.data[item]

        // Parse the item string to an integer
        const itemAsNumber = parseInt(item, 10)

        // Check if the parsing was successful
        if (!isNaN(itemAsNumber)) {
          await addDoc(collection(db, 'ClientSubTasks'), {
            clientTaskId: clientTaskRef.id,
            clientId: user.uid,
            taskAvailable: true,
            taskOngoingClient: false,
            taskCompletedClient: false,
            employeeId: null,
            taskOngoingEmployee: false,
            taskCompletedEmployee: false,
            submitForReview: false,
            reviewCompleted: false,
            taskStorage: null,
            commentEmployee: null,
            commentClient: null,
            reviewClient: false,
            reviewEmployee: false,
            description: subTaskDescription,
            key: itemAsNumber,
            mainTaskName: task.name
          })
        } else {
          console.error('Failed to parse key:', item)
        }
      }

      // Close the Dialog
      handleClose()
    } catch (error) {
      console.error('Error adding document: ', error)
    }
  }

  return (
    <Fragment>
      <Button variant='outlined' onClick={handleClickOpen}>
        Add Task
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Add new task</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>To add the new task please submit your requirements.</DialogContentText>
          <Stack spacing={2}>
            <TextField
              id='name'
              autoFocus
              fullWidth
              type='text'
              label='Task Name'
              name='name'
              onChange={handleChange}
            />
            <TextField
              id='description'
              fullWidth
              type='text'
              label='Description'
              name='description'
              onChange={handleChange}
            />
            <TextField id='duration' fullWidth type='text' label='Duration' name='duration' onChange={handleChange} />
            <TextField id='budget' fullWidth type='text' label='Budget' name='budget' onChange={handleChange} />
          </Stack>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleSubmit()
              handleSnackClick()
            }}
          >
            Add
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
  )
}

export default AddTask
