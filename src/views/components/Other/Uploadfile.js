import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from 'src/configs/firebase'

const UploadFile = async file => {
  // Create a storage reference for the file
  const storageRef = ref(storage, 'files/' + file.name)

  // Upload the file to the reference
  const snapshot = await uploadBytes(storageRef, file)

  // Get the download URL for the uploaded file
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL // You may return the download URL or any other information you need
}

export default UploadFile
