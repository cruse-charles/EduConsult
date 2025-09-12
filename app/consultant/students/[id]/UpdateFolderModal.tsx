import CustomToast from '@/app/components/CustomToast'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { renameFolder } from '@/lib/assignmentUtils'
import { renameFolderInStudentAssignmentsSlice } from '@/redux/slices/currentStudentAssignmentsSlice'
import { renameFolderInStudentSlice } from '@/redux/slices/currentStudentSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { Save, X } from 'lucide-react'
import { useParams } from 'next/navigation'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

interface UpdateFolderModalProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    oldFolderName: string | null
}

const UpdateFolderModal = ({open, onOpenChange, oldFolderName}: UpdateFolderModalProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [confirmOpen, setConfirmOpen] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const studentId = id as string
    const user = useSelector((state: RootState) => state.user)



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // Update folder in Firebase
            if (oldFolderName) {
                await renameFolder(studentId, oldFolderName, newFolderName, user.id)
            }

            // Update folder in redux
            // TODO: UPDATE REDUX ON CONSULTANTDASHBOARD ASSIGNMENTS
            dispatch(renameFolderInStudentSlice({oldFolderName, newFolderName}))
            dispatch(renameFolderInStudentAssignmentsSlice({oldFolderName, newFolderName}))
            toast(<CustomToast title='Folder Renamed' description={`Folder has been renamed to ${newFolderName}.`} status="success"/>)
        } catch (error) {
            console.error("Error renaming folder:", error);
            toast(<CustomToast title='Error renaming folders.' description="Please refresh and try again." status="error"/>)
        }
    }

    useEffect(() => {
        if (oldFolderName) {
            setNewFolderName(oldFolderName)
        }
    }, [oldFolderName])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Enter New Folder Name
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}/>
                        <div className="flex justify-between items-center">
                        {/* LEFT SIDE */}
                        <Button variant="destructive" type="button">
                            Delete
                        </Button>

                        {/* RIGHT SIDE */}
                        <div className="flex gap-2">
                            <Button variant="outline" type="submit">
                            <Save className="h-4 w-4" />
                            {isLoading ? 'Saving...' : 'Save'}
                            </Button>

                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4" />
                            Cancel
                            </Button>
                        </div>
                        </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateFolderModal