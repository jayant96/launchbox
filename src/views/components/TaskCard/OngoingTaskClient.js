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
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const OngoingTaskClient = ({ user }) => {
  // ** State
  const [showList, setShowList] = useState(false)
  const [tasks, setTasks] = useState([])

  const router = useRouter()

  useEffect(() => {
    const fetchTasks = () => {
      const tasksRef = collection(db, 'ClientSubTasks')
      const q = query(tasksRef, where('clientId', '==', user.uid), where('taskOngoingClient', '==', true))
      const unsubscribe = onSnapshot(
        q,
        querySnapshot => {
          const fetchedTasks = querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            }
          })
          setTasks(fetchedTasks)
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
          {tasks &&
            tasks.slice().map((task, i) => (
              <ListItem key={i}>
                <Card
                  elevation={24}
                  sx={{ maxWidth: 345, width: '100%', cursor: 'pointer' }}
                  onClick={() => router.push(`/task/${task.id}`)}
                >
                  <CardContent>
                    <Typography variant='h5' component='div'>
                      {task.mainTaskName}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Description: {task.description}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
        </List>
      )}
    </Fragment>
  )
}

export default OngoingTaskClient
