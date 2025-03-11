import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { AssignmentFormData } from '@/lib/types/types';
import { RootState } from '@/redux/store';

import { useSelector } from 'react-redux';

interface FolderSelectionProps {
    formData: AssignmentFormData;
    handleInputChange: (field: string, value: string) => void;
    setNewFolder: (value: boolean) => void;
    newFolder: boolean;
}

function FolderSelection({formData, handleInputChange, setNewFolder, newFolder}: FolderSelectionProps) {
    
    // Retrieve student state from redux
    const student = useSelector((state: RootState) => state.student)

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="priority">Folder  <span className="text-red-500">*</span></Label>
                
                {/* Handle form data for a user using an existing folder or creating one */}
                <Select required value={newFolder ? "create-new" : formData.folder}
                    onValueChange={(value) => {
                        if (value === 'create-new') {
                            setNewFolder(true)
                            handleInputChange("folder", "")
                        } else {
                            setNewFolder(false)
                            handleInputChange("folder", value)
                        }
                    }}>
                <SelectTrigger>
                    <SelectValue placeholder="Select or create folder" />
                </SelectTrigger>
                <SelectContent>
                    {student.folders?.map((folder: string) => (
                        <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                    ))}
                    <SelectItem value="create-new">+ Create New Folder</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
            {/* If user is creating a new folder, render input tags */}
            { newFolder && (
                <div className="space-y-2">
                    <Label htmlFor="folder-name">New Folder Name</Label>
                    <Input id="folder" placeholder="Enter new folder name" value={formData.folder} onChange={(e) => handleInputChange("folder", e.target.value)} />
                </div>
            )}
        </>
    )
}

export default FolderSelection