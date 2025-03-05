import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Assignment, Student } from '@/lib/types/types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

interface FolderSelectionProps {
    formData: Assignment;
    handleInputChange: (field: string, value: string) => void;
    setNewFolder: (value: boolean) => void;
    newFolder: boolean;
}

function FolderSelection({formData, handleInputChange, setNewFolder, newFolder}: FolderSelectionProps) {
    const student = useSelector((state) => state.student)

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="priority">Folder  <span className="text-red-500">*</span></Label>
                <Select required value={newFolder ? "create-new" : formData.folderName} 
                    onValueChange={(value) => {
                        if (value === 'create-new') {
                            setNewFolder(true)
                            handleInputChange("folderName", "")
                        } else {
                            setNewFolder(false)
                            handleInputChange("folderName", value)
                        }
                    }}>
                <SelectTrigger>
                    <SelectValue placeholder="Select or create folder" />
                </SelectTrigger>
                <SelectContent>
                    {student.folders?.map((folder) => (
                        <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                    ))}
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