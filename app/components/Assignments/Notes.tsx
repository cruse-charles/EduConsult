import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AssignmentFormData } from '@/lib/types/types';

interface NotesProps {
    formData: AssignmentFormData
    handleInputChange: (field: string, value: string) => void;
}

function Notes({formData, handleInputChange}: NotesProps) {
    return (
        <>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="notes">Assignment Notes</Label>
                    <Textarea id="notes" placeholder="Add any instructions, requirements, or additional notes for this assignment..." value={formData.note} onChange={(e) => handleInputChange("note", e.target.value)} rows={4} />
                </div>
            </div>
        </>
    )
}

export default Notes