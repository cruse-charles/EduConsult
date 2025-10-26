import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { AssignmentFormData } from '@/lib/types/types';
import { RootState } from '@/redux/store';
import { Info } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import { useSelector } from 'react-redux';

interface FolderSelectionProps {
    formData: AssignmentFormData;
    handleInputChange: (field: string, value: string) => void;
    setNewFolder: (value: boolean) => void;
    newFolder: boolean;
    setErrors: Dispatch<SetStateAction<{ title?: string; type?: string; priority?: string; folder?: string; dueDate?: string; folderName?: string; }>>;
    errors: {title?: string; type?: string; priority?: string; folder?: string; dueDate?: string; folderName?: string;};
    isBulkMode: boolean;
}

function FolderSelection({formData, handleInputChange, setNewFolder, newFolder, setErrors, errors, isBulkMode}: FolderSelectionProps) {
    
    // Retrieve student state from redux
    const student = useSelector((state: RootState) => state.currentStudent.data)

    // Bulk mode — just a text input, no dropdown
    if (isBulkMode) {
        return (
            <div className="space-y-2">
                <Label htmlFor="folder">Folder <span className="text-red-500">*</span></Label>
                <Input
                    id="folder"
                    placeholder="Enter folder name, e.g., Stanford Essays"
                    value={formData.folder}
                    onChange={(e) => handleInputChange("folder", e.target.value)}
                />
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>
                        If a student already has a folder with this name, the assignment will be added to 
                        their existing folder. Otherwise, a new folder will be created for them.
                    </p>
                </div>
                {errors?.folder && <p className="text-sm text-red-500">{errors.folder}</p>}
            </div>
        )
    }

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
                    <SelectValue role='select-folder' placeholder="Select or create folder, e.g., Stanford Folder " />
                </SelectTrigger>
                <SelectContent>
                    {student.system?.folders?.map((folder: string) => (
                        <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                    ))}
                    <SelectItem role='option' value="create-new">+ Create New Folder</SelectItem>
                </SelectContent>
                </Select>
                {errors?.folder && <p className="text-sm text-red-500">{errors.folder}</p>}
            </div>
            
            {/* If user is creating a new folder, render input tags */}
            { newFolder && (
                <div className="space-y-2">
                    <Label htmlFor="folder-name">New Folder Name</Label>
                    <Input id="folder" placeholder="Enter new folder name" value={formData.folder} onChange={(e) => handleInputChange("folder", e.target.value)} />
                    {errors.folderName && <p className='text-sm text-red-500'>{errors.folderName}</p>}
                </div>
            )}
        </>
    )
}

export default FolderSelection