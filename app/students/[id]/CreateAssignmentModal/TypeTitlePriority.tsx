import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { AssignmentFormData } from '@/lib/types/types'
import { Dispatch, SetStateAction, useEffect } from 'react';

interface TypeTitlePriorityProps {
    formData: AssignmentFormData;
    handleInputChange: (field: string, value: string) => void;
    setErrors: Dispatch<SetStateAction<{ title?: string; type?: string; priority?: string; folder?: string; dueDate?: string }>>;
    errors: {title?: string; type?: string; priority?: string; folder?: string; dueDate?: string;};
}

function TypeTitlePriority({formData, handleInputChange, setErrors, errors}: TypeTitlePriorityProps) {

    useEffect(() => {
        console.log('errors', errors)
    }, [errors])


    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="title">
                    Assignment Title <span className="text-red-500">*</span>
                </Label>
                <Input id="title" placeholder="e.g., Stanford Application Essay" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)}   />
                {errors?.title && <p className="text-sm text-red-500">{errors.title}</p>}
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
                    {errors?.type && <p className="text-sm text-red-500">{errors.type}</p>}
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