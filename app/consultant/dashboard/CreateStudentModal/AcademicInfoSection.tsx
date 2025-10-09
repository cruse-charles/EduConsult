import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentFormData } from '@/lib/types/types';

interface AcademicInfoSectionProps {
    formData: StudentFormData;
    handleAcademicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAcademicInfoSelectChange: (name: string, value: string) => void;
}

function AcademicInfoSection({formData, handleAcademicInfoChange, handleAcademicInfoSelectChange}: AcademicInfoSectionProps) {

    const safeValue = (value: number | null) => (value === null || isNaN(value) ? '' : value);

    const grades = [ "6", "7", "8", "9", "10", "11", "12", "Freshman", "Sophomore", "Junior", "Senior" ]

    return (
        <>
            <div className="space-y-4">
                <h3 className="text-md font-medium text-muted-foreground">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentSchool">
                            Current School <span className="text-red-500">*</span>
                        </Label>
                        <Input id="currentSchool" placeholder="Lincoln High School" value={formData.academics.currentSchool} name="currentSchool" onChange={handleAcademicInfoChange} required />
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="grade">
                            Grade Level <span className="text-red-500">*</span>
                        </Label>
                        <Input id="grade" placeholder="12" value={safeValue(formData.academics.grade)} name="grade" onChange={handleAcademicInfoChange} required />
                    </div> */}
                    <div className="space-y-2">
                        <Label>
                            Grade Level <span className="text-red-500">*</span>
                        </Label>
                            <Select value={formData.academics.grade?.toString()} onValueChange={(value) => handleAcademicInfoSelectChange("grade", value)} >
                            <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                            </SelectTrigger>

                            <SelectContent className="max-h-60 overflow-y-auto">
                                {grades.map((g) => (
                                    <SelectItem key={g} value={g}>
                                    {g}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Applying For <span className="text-red-500">*</span>
                        </Label>

                        <Select
                            value={formData.academics.applyingFor || ""}
                            onValueChange={(value) => handleAcademicInfoSelectChange("applyingFor", value)}>
                            
                            <SelectTrigger>
                                <SelectValue placeholder="Select program" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="highschool">High School</SelectItem>
                                <SelectItem value="college">College</SelectItem>
                                <SelectItem value="graduate">Graduate School</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="intendedMajor">
                            Intended Major
                        </Label>
                        <Input id="intendedMajor" placeholder="Computer Science" value={formData.academics.intendedMajor} name="intendedMajor" onChange={handleAcademicInfoChange} />
                    </div> */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input id="gpa" step="any" placeholder="3.85" value={safeValue(formData.academics.gpa)} name="gpa" onChange={handleAcademicInfoChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="satScore">SAT Score</Label>
                        <Input id="satScore" placeholder="1450" value={safeValue(formData.academics.sat)} name="sat" onChange={handleAcademicInfoChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="actScore">ACT Score</Label>
                        <Input id="actScore" placeholder="30" value={safeValue(formData.academics.act)} name="act" onChange={handleAcademicInfoChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="toeflScore">TOEFL Score</Label>
                        <Input id="toeflScore" placeholder="105" value={safeValue(formData.academics.toefl)} name="toefl" onChange={handleAcademicInfoChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ieltsScore">IELTS Score</Label>
                        <Input id="ieltsScore" placeholder="6.5" value={safeValue(formData.academics.ielts)} name="ielts" onChange={handleAcademicInfoChange} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AcademicInfoSection