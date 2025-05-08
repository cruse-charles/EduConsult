import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StudentFormData } from "@/lib/types/types";

interface PersonalInfoSectionProps {
    formData: StudentFormData;
    handlePersonalInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PersonalInfoSection({formData, handlePersonalInfoChange}: PersonalInfoSectionProps) {
    return (
        <>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input id="firstName" placeholder="Enter first name" value={formData.personalInformation.firstName} name="firstName" onChange={handlePersonalInfoChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                        <Input id="lastName" placeholder="Enter last name" value={formData.personalInformation.lastName} name="lastName" onChange={handlePersonalInfoChange} required />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Additional Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div className="space-y-2">
                        <Label htmlFor="email">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input id="email" type="email" placeholder="student@example.com" value={formData.personalInformation.email} name="email" onChange={handlePersonalInfoChange} required/>
                    </div> */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.personalInformation.phone} name="phone" onChange={handlePersonalInfoChange} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="wechat">Other</Label>
                    <Input id="wechat" placeholder="Other Contact Info" value={formData.personalInformation.other} name="other" onChange={handlePersonalInfoChange} />
                </div>
            </div>
        </>
    )
}

export default PersonalInfoSection