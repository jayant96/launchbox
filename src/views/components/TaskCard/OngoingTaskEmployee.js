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
    console.log(' user.uid', user.uid)
    const tasksRef = collection(db, 'ClientSubTasks')
    const q = query(tasksRef, where('employeeId', '==', user.uid), where('taskOngoingEmployee', '==', true))
    let unsubscribe
    try {
      unsubscribe = onSnapshot(
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
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }

    // Directly return the unsubscribe function here
    return unsubscribe
  }, [])

  const handleShowList = () => setShowList(!showList)

  return (
    <Fragment>
      <Button variant='outlined' onClick={handleShowList}>
        Show Tasks
      </Button>
      {showList && (
        <List>
          {tasks
            .slice()
            .reverse()
            .map((task, i) => (
              <ListItem key={i}>
                <Card
                  elevation={24}
                  sx={{ maxWidth: 345, width: '100%', cursor: 'pointer' }}
                  onClick={() => router.push(`/task/${task.id}`)}
                >
                  <CardContent>
                    <Typography variant='body2' color='text.secondary'>
                      <strong>Description: </strong>
                      {task.description}
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
