import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Assignment } from '@/lib/types/types'

interface TypeTitlePriorityProps {
    formData: Assignment;
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
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    )
}

export default TypeTitlePriority