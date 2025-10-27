// components/assignments/CreateAssignmentModal/StudentSelector.tsx
'use client'

import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface StudentSelectorProps {
    selectedStudentIds: string[]
    onChange: (ids: string[]) => void
    error?: string
}

export function StudentSelector({ selectedStudentIds, onChange, error }: StudentSelectorProps) {
    const students = useSelector((state: RootState) => state.students.data)

    const sortedStudents = [...students].sort((a, b) => {
        const lastNameCompare = a.profile.lastName.localeCompare(b.profile.lastName)
        return lastNameCompare !== 0 
            ? lastNameCompare 
            : a.profile.firstName.localeCompare(b.profile.firstName)
    })

    const toggleStudent = (studentId: string) => {
        const updated = selectedStudentIds.includes(studentId)
            ? selectedStudentIds.filter(id => id !== studentId)
            : [...selectedStudentIds, studentId]
        onChange(updated)
    }

    const toggleAll = () => {
        const allIds = students.map(s => s.id)
        onChange(selectedStudentIds.length === students.length ? [] : allIds)
    }

    const allSelected = selectedStudentIds.length === sortedStudents.length

    return (
        <div className="space-y-2">
            <Label>Students <span className="text-red-500">*</span></Label>

            <div className="border rounded-md p-3 space-y-3">
                {/* Select all row */}
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Checkbox
                        id="select-all"
                        checked={allSelected}
                        onCheckedChange={toggleAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                        {allSelected ? "Deselect all" : "Select all"} ({sortedStudents.length})
                    </Label>
                    {selectedStudentIds.length > 0 && !allSelected && (
                        <span className="text-xs text-muted-foreground ml-auto">
                            {selectedStudentIds.length} selected
                        </span>
                    )}
                </div>

                {/* Scrollable student list */}
                <div className="max-h-20 overflow-y-auto space-y-2 pr-1">
                    {sortedStudents.map(student => (
                        <div key={student.id} className="flex items-center gap-2">
                            <Checkbox
                                id={student.id}
                                checked={selectedStudentIds.includes(student.id)}
                                onCheckedChange={() => toggleStudent(student.id)}
                            />
                            <Label htmlFor={student.id} className="text-sm cursor-pointer">
                                {student.profile.firstName} {student.profile.lastName}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}