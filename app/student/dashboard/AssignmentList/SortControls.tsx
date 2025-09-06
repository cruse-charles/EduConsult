import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface SortControlsProps {
    folderSort: string
    assignmentSort: string
    setFolderSort: (value: string) => void
    setAssignmentSort: (value: string) => void
}

const SortControls = ({folderSort, assignmentSort, setFolderSort, setAssignmentSort}: SortControlsProps) => {
    
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort folders by:</span>
                    <Select value={folderSort} onValueChange={setFolderSort}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="due">Closest Due Date</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort assignments by:</span>
                    <Select value={assignmentSort} onValueChange={setAssignmentSort}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="due">Due Date</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default SortControls