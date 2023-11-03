// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Next imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

// ** Firebase Imports
import { db } from 'src/configs/firebase'
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore'

const AddedTask = ({ user }) => {
  // ** State
  const [showList, setShowList] = useState(false)
  const [clientTasks, setClientTasks] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchTasks = () => {
      const tasksRef = collection(db, 'ClientTasks')
      const q = query(tasksRef, where('clientId', '==', user.uid))
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const fetchedTasks = querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            }
          })
          setClientTasks(fetchedTasks)
        },
        error => {
          console.error('Error fetching tasks:', error)
        }
      )
      return unsubscribe
    }

    return fetchTasks()
  }, [user.uid])

  const handleShowList = () => setShowList(!showList)

  return (
    <Fragment>
      <Button variant='outlined' onClick={handleShowList}>
        Show Tasks
      </Button>
      {showList && (
        <List>
          {clientTasks
            .slice()
            .reverse()
            .map((task, i) => (
              <ListItem key={i}>
                <Card elevation={24} sx={{ maxWidth: 345, width: '100%' }}>
                  <CardContent>
                    <Typography variant='h5' component='div'>
                      {task.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Description: {task.description}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Duration: {task.duration}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Budget: {task.budget}
                    </Typography>
                    <Box mt={2}>
                      <Button variant='outlined' onClick={() => router.push(`/subTask/${task.id}`)}>
                        Edit Task
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
        </List>
      )}
    </Fragment>
  )
}

export default AddedTask
