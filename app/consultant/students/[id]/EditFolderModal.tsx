import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface EditFolderModalProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (oldFolderName: string, newFolderName: string) => void,
    oldFolderName: string | null
}

const EditFolderModal = ({open, onOpenChange, handleSave, oldFolderName}: EditFolderModalProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (oldFolderName) {
            handleSave(oldFolderName, newFolderName)
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
                    <div className="flex justify-end gap-2">
                        <Button variant='outline' type='submit'> <Save className="h-4 w-4" /> {isLoading ? 'Saving...' : 'Save'}</Button>
                        <Button variant='outline' onClick={() => onOpenChange(false)}><X className="h-4 w-4" /> Cancel</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditFolderModal