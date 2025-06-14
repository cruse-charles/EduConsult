import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Assignment } from '@/lib/types/types';

interface NotesProps {
    formData: Assignment
    handleInputChange: (field: string, value: string) => void;
}

function Notes({formData, handleInputChange}: NotesProps) {
    return (
        <>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="notes">Assignment Notes</Label>
                    <Textarea id="notes" placeholder="Add any instructions, requirements, or additional notes for this assignment..." value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} rows={4} />
                </div>
            </div>
        </>
    )
}

export default Notes