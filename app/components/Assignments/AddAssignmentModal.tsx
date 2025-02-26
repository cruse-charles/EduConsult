'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, FileText, Plus, Upload } from "lucide-react"
import { useState } from "react"
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, uploadBytes  } from "firebase/storage";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


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

    }

    // handle file upload, upload each file to Firebase Storage
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target.files
        console.log(files);

        if (!files) {
            console.error('No files selected');
            return;
        }

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

    const handleInputChange = (value, type) => {

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
                    <div className="space-y-2">
                    <Label htmlFor="title">
                        Assignment Title <span className="text-red-500">*</span>
                      </Label>
                      <Input id="title" placeholder="e.g., Stanford Application Essay" name='title' value={formData.title} onChange={handleInputChange} required   />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">
                          Assignment Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.type} onValueChange={(value) => console.log("type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="essay">Essay</SelectItem>
                            <SelectItem value="application">Application</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="portfolio">Portfolio</SelectItem>
                            <SelectItem value="test-prep">Test Preparation</SelectItem>
                            <SelectItem value="recommendation">Recommendation Letter</SelectItem>
                            <SelectItem value="interview-prep">Interview Preparation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
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