// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useAuth } from 'src/hooks/useAuth'
import { useState, useEffect, Fragment } from 'react'
import OnBoardingForm from 'src/@core/layouts/components/shared-components/OnBoardingForm'
import AddTask from 'src/views/components/TaskCard/AddTask'
import AddedTask from 'src/views/components/TaskCard/AddedTask'
import AvailableTask from 'src/views/components/TaskCard/AvailableTask'
import OngoingTaskClient from 'src/views/components/TaskCard/OngoingTaskClient'
import CompletedTaskClient from 'src/views/components/TaskCard/CompletedTaskClient'
import OngoingTaskEmployee from 'src/views/components/TaskCard/OngoingTaskEmployee'
import CompletedTaskEmployee from 'src/views/components/TaskCard/CompletedTaskEmployee'

const Home = () => {
  const { user } = useAuth()
  const [showOnBoarding, setShowOnBoarding] = useState(false)

  useEffect(() => {
    if (user && !user.onBoarding) {
      setShowOnBoarding(true)
    }
  }, [user])

  const handleOnBoardingClose = () => {
    setShowOnBoarding(false)
  }

  return (
    <Fragment>
      {showOnBoarding && <OnBoardingForm user={user} open={showOnBoarding} onClose={handleOnBoardingClose} />}
      {user && user.role && user.role == 'Client' && (
        <Grid container spacing={6}>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Add task'></CardHeader>
              <CardContent>
                <AddTask user={user} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Added Task'></CardHeader>
              <CardContent>
                <AddedTask user={user} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Ongoing Task'></CardHeader>
              <CardContent>
                <OngoingTaskClient user={user} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Completed Task'></CardHeader>
              <CardContent>
                <CompletedTaskClient user={user} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {user && user.role && user.role == 'Employee' && (
        <Grid container spacing={6}>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Available Task'></CardHeader>
              <CardContent>
                <AvailableTask user={user} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Ongoing Task'></CardHeader>
              <CardContent>
                <OngoingTaskEmployee user={user} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Card>
              <CardHeader title='Completed Task'></CardHeader>
              <CardContent>
                <CompletedTaskEmployee user={user} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Fragment>
  )
}

export default Home
