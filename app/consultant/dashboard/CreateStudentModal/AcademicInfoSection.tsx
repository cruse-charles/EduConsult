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

    const type = formData.academics.applyingFor

    return (
        <>
            <div className="space-y-4">
                <h3 className="text-md font-medium text-muted-foreground">Academic Information</h3>

                {/* Current School */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentSchool">
                            Current School <span className="text-red-500">*</span>
                        </Label>
                        <Input id="currentSchool" placeholder="Lincoln High School" value={formData.academics.currentSchool} name="currentSchool" onChange={handleAcademicInfoChange} required />
                    </div>

                    {/* Grade Level */}
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

                    {/* School Type */}
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
                </div>
                
                {/* Academic Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* HIGH SCHOOL */}
                    {type === "highschool" && (
                        <>
                            <div className="space-y-2">
                                <Label>GPA</Label>
                                <Input name="gpa" placeholder='3.85' value={safeValue(formData.academics.gpa)} onChange={handleAcademicInfoChange} />
                            </div>

                            <div className="space-y-2">
                                <Label>Vericant Score</Label>
                                <Input name="vericant" placeholder="5.5" onChange={handleAcademicInfoChange} />
                            </div>
                        </>
                    )}

                    {/* COLLEGE */}
                    {type === "college" && (
                        <>
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
                        </>
                    )}

                    {/* GRADUATE */}
                    {type === "graduate" && (
                        <>
                        <div className="space-y-2">
                            <Label>GPA</Label>
                            <Input name="gpa"  placeholder="3.85" value={safeValue(formData.academics.gpa)} onChange={handleAcademicInfoChange} />
                        </div>

                        <div className="space-y-2">
                            <Label>Current Major</Label>
                            <Input name="major" placeholder="Computer Science" onChange={handleAcademicInfoChange} />
                        </div>

                        <div className="space-y-2">
                            <Label>Intended Master's Major</Label>
                            <Input name="intendedMajor" placeholder="Mechanical Engineering" value={formData.academics.intendedMajor} onChange={handleAcademicInfoChange} />
                        </div>

                        <div className="space-y-2">
                            <Label>IELTS Score</Label>
                            <Input name="ielts" placeholder="8.5" value={safeValue(formData.academics.ielts)} onChange={handleAcademicInfoChange} />
                        </div>

                        <div className="space-y-2">
                            <Label>TOEFL Score</Label>
                            <Input name="toefl" placeholder="110" value={safeValue(formData.academics.toefl)} onChange={handleAcademicInfoChange} />
                        </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default AcademicInfoSection