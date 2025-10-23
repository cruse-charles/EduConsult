import { useState } from "react"
import { getEmptyFormData } from "../buildAssignmentData"
import { useAssignmentValidation } from "../useAssignmentValidation"
import { useFiles } from "@/hooks/useFiles"

// @ts-ignore
export const useAssignmentForm = (student, user) => {
    // State to manage assignment details
    const [formData, setFormData] = useState(getEmptyFormData(student, user))
    const [dueDate, setDueDate] = useState<Date | undefined>()
    const [newFolder, setNewFolder] = useState(false)
    const {errors, setErrors, validate} = useAssignmentValidation()
    const { files, handleFileUpload, removeFile, clearFiles} = useFiles();

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
        ...prev,
        [name]: value
        }))

        setErrors({})
    }

    // Reset the form data
    const resetForm = () => {
        // Reset form data to initial state, clear files, reset due date and new folder state
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

        // Error handling and validation
        validate,
        errors,
        setErrors,

        // File handling
        files, 
        handleFileUpload, 
        removeFile,
    }
}