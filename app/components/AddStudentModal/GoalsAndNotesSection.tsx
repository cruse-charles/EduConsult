import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

function GoalsAndNotesSection({formData, handleAcademicInfoChange, handlePersonalInfoChange}) {
    return (
        <>
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Goals & Notes</h3>
                <div className="space-y-2">
                    <Label htmlFor="targetSchools">Target Schools</Label>
                    <Input
                    id="targetSchools"
                    placeholder="Stanford University, Harvard University, MIT"
                    value={formData.targetSchools}
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
                    value={formData.notes}
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