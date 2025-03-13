import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AssignmentFormData } from '@/lib/types/types'

interface TypeTitlePriorityProps {
    formData: AssignmentFormData;
    handleInputChange: (field: string, value: string) => void;
}

function TypeTitlePriority({formData, handleInputChange}: TypeTitlePriorityProps) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="title">
                    Assignment Title <span className="text-red-500">*</span>
                </Label>
                <Input id="title" placeholder="e.g., Stanford Application Essay" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required   />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">
                    Assignment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Essay">Essay</SelectItem>
                        <SelectItem value="Application">Application</SelectItem>
                        <SelectItem value="Document">Document</SelectItem>
                        <SelectItem value="Portfolio">Portfolio</SelectItem>
                        <SelectItem value="Test Prep">Test Preparation</SelectItem>
                        <SelectItem value="Recommendation Letter">Recommendation Letter</SelectItem>
                        <SelectItem value="Interview Prep">Interview Preparation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}

export default TypeTitlePriority