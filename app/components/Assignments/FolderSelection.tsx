import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Assignment } from '@/lib/types/types';

interface FolderSelectionProps {
    formData: Assignment;
    handleInputChange: (field: string, value: string) => void;
    setNewFolder: (value: boolean) => void;
    newFolder: boolean;
}

function FolderSelection({formData, handleInputChange, setNewFolder, newFolder}: FolderSelectionProps) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="priority">Folder</Label>
                <Select value={newFolder ? "create-new" : formData.folderName} 
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