import { useState } from "react"
import { getEmptyFormData } from "../buildAssignmentData"
import { useAssignmentValidation } from "../useAssignmentValidation"
import { useFiles } from "@/hooks/useFiles"

// @ts-ignore
export const useAssignmentForm = (student, user) => {
  const [formData, setFormData] = useState(getEmptyFormData(student, user))
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [newFolder, setNewFolder] = useState(false)
  const {errors, setErrors, validate} = useAssignmentValidation()
  const { files, handleFileUpload, removeFile, clearFiles} = useFiles();

    // TODO: The handleInput change isn't setting the errors back to nothing when I start typing in the form
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setErrors({})
  }

  const resetForm = () => {
    setFormData(getEmptyFormData(student, user))
    clearFiles()
    setDueDate(undefined)
    setNewFolder(false)
  }

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
    dueDate,
    setDueDate,
    newFolder,
    setNewFolder,
    validate,
    errors,
    setErrors,
    files, 
    handleFileUpload, 
    removeFile,
  }
}