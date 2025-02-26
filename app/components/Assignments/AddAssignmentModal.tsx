'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, FileText, Plus, Upload, X } from "lucide-react"
import { useState } from "react"
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TypeTitlePriority from "./TypeTitlePriority"
import FileUploadView from "./FileUploadView"


function AddAssignmentModal() {
    const [dueDate, setDueDate] = useState(null)
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        type: "essay",
        priority: "medium",
        assignedStudent: "",
        dueDate: null,
        notes: "",
    })

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    }

    // handle file upload, upload each file to Firebase Storage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target.files
        console.log(files);

        if (!files) {
            console.error('No files selected');
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);

        for (const file of Array.from(files) as File[]) {
            // Create a storage reference
            const storageRef = ref(storage, `${file.name}`);
            
            // Upload the file to the storage reference
            try {
                const snapshot = uploadBytes(storageRef, file)
                console.log('Uploaded a blob or file!', snapshot);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    }

    const handleSubmit = () => {

    }

    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        console.log(formData)
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create New Assignment
              </DialogTitle>
              <DialogDescription>Create a new assignment for a student. Fill out the details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <TypeTitlePriority formData={formData} handleInputChange={handleInputChange}/>
                    <FileUploadView handleFileUpload={handleFileUpload} removeFile={removeFile} files={files}/>
                </div>
            </form>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssignmentModal