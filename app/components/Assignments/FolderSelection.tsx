import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

function FolderSelection({formData, handleInputChange, setNewFolder, newFolder}) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="priority">Folder</Label>
                <Select value={formData.folderName} onValueChange={(value) => value === 'create-new' ? setNewFolder(true) : handleInputChange("folderName", value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select or create folder" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="create-new">+ Create New Folder</SelectItem>
                </SelectContent>
                </Select>
            </div>
            { newFolder && (
                <div className="space-y-2">
                    <Label htmlFor="folder-name">New Folder Name</Label>
                    <Input id="folder-name" placeholder="Enter new folder name" value={formData.folderName} onChange={(e) => handleInputChange("folderName", e.target.value)} />
                </div>
            )}
        </>
    )
}

export default FolderSelection