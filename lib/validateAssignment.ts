import { useState } from "react";

// Validate form inputs and set error messages
export const useAssignmentValidation  = () => {
    // const [errors, setErrors] = useState<{title?: string; type?: string; priority?: string; folder?: string; dueDate?: string; folderName?: string;}>({})
        
    // const newErrors: { title?: string; type?: string; priority?: string; folder?: string; dueDate?: string; folderName?: string;} = {}

    const [errors, setErrors] = useState({})

    // @ts-ignore
    const validate = (formData, dueDate, newFolder, student) => {
        const newErrors: any = {}

        if (!formData.title) newErrors.title = 'A title is required.'
        if (!formData.type) newErrors.type = 'A type is required.'
        if (!formData.folder) newErrors.folder = 'Please select a folder or input a new folder name.'
        if (!dueDate) newErrors.dueDate = 'Please select a due date.'
        if (newFolder && student.system?.folders?.includes(formData.folder)) {
            newErrors.folderName = 'Folder name already used.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    return { errors, validate, setErrors }
}