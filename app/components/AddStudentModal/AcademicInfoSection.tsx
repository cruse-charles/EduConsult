import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StudentFormData } from '@/lib/types/types';

interface AcademicInfoSectionProps {
    formData: StudentFormData;
    handleAcademicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function AcademicInfoSection({formData, handleAcademicInfoChange}: AcademicInfoSectionProps) {
  return (
    <>
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="currentSchool">
                        Current School <span className="text-red-500">*</span>
                    </Label>
                    <Input id="currentSchool" placeholder="Lincoln High School" value={formData.academicInformation.currentSchool} name="currentSchool" onChange={handleAcademicInfoChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="grade">
                        Grade Level <span className="text-red-500">*</span>
                    </Label>
                    <Input id="grade" placeholder="12th Grade" value={formData.academicInformation.grade} name="grade" onChange={handleAcademicInfoChange} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input id="gpa" placeholder="3.85" value={formData.academicInformation.gpa} name="gpa" onChange={handleAcademicInfoChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="satScore">SAT Score</Label>
                    <Input id="satScore" placeholder="1450" value={formData.academicInformation.sat} name="sat" onChange={handleAcademicInfoChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="toeflScore">TOEFL Score</Label>
                    <Input id="toeflScore" placeholder="105" value={formData.academicInformation.toefl} name="toefl" onChange={handleAcademicInfoChange} />
                </div>
            </div>
        </div>
    </>
  )
}

export default AcademicInfoSection