import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StudentFormData } from '@/lib/types/types';

interface GoalsAndNotesSectionProps {
    formData: StudentFormData;
    handleAcademicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePersonalInfoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function GoalsAndNotesSection({formData, handleAcademicInfoChange, handlePersonalInfoChange} : GoalsAndNotesSectionProps) {
    return (
        <>
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Goals & Notes</h3>
                <div className="space-y-2">
                    <Label htmlFor="targetSchools">Target Schools</Label>
                    <Input
                    id="targetSchools"
                    placeholder="Stanford University, Harvard University, MIT"
                    value={formData.academicInformation.targetSchools}
                    name="targetSchools"
                    onChange={handleAcademicInfoChange}
                    />
                    <p className="text-xs text-muted-foreground">Separate multiple schools with commas</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                    id="notes"
                    placeholder="Any additional information about the student..."
                    value={formData.personalInformation.notes}
                    name="notes"
                    onChange={handlePersonalInfoChange}
                    rows={3}
                    />
                </div>
            </div>
        </>
    )
}

export default GoalsAndNotesSection