import { useState } from "react"

export const useFiles = (initialFiles: File[] = []) => {
    const [files, setFiles] = useState(initialFiles)

    // TODO: add monitor uploading process, use these links: 
        // https://firebase.google.com/docs/storage/web/upload-files
        // https://www.youtube.com/watch?v=fgdpvwEWJ9M start at around 30:00
    // Handle file upload, upload each file to Firebase Storage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target.files

        // Check if files are uploaded
        if (!files) {
            console.error('No files selected');
            return;
        }

        // Add the selected files to the state
        setFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);

        // Reset the input value to allow re-uploading the same file
        event.target.value = "";
    }

    // TODO: Remove from storage and select based on file name
    const removeFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    const clearFiles = () => {
        setFiles([])
    }

    return {
        files,
        setFiles,
        handleFileUpload,
        removeFile,
        clearFiles,
    }
}