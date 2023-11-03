import { useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'src/configs/firebase'

import formFields from 'src/data/ReviewTaskForm.json'

const ReviewTaskForm = ({ taskId, open, onClose }) => {
  const [formData, setFormData] = useState({})
  const { user } = useAuth()

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const isFormComplete = () => {
    return Object.values(formData).every(x => x !== null && x !== '')
  }

  const handleSubmit = async () => {
    if (isFormComplete()) {
      const userRef = doc(db, 'ClientSubTasks', taskId)
      const updateReviewFormData = {
        [`${user.role === 'Employee' ? 'reviewEmployee' : 'reviewClient'}`]: true,
        [`${user.role === 'Employee' ? 'reviewDataEmployee' : 'reviewDataClient'}`]: formData
      }
      await updateDoc(userRef, updateReviewFormData)
      onClose()
    } else {
      alert('Please fill out all fields before submitting.')
    }
  }

  return (
    <Dialog open={open} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>Task Review Form</DialogTitle>
      <DialogContent>
        {user &&
          formFields[user.role] &&
          formFields[user.role].map(field => {
            if (field.type === 'text') {
              return <TextField key={field.name} name={field.name} label={field.label} onChange={handleChange} />
            } else if (field.type === 'dropdown') {
              return (
                <Select key={field.name} name={field.name} label={field.label} onChange={handleChange}>
                  {field.options.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )
            } else {
              return null
            }
          })}
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewTaskForm
