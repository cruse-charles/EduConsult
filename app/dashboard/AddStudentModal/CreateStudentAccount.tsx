import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'

const CreateStudentAccount = ({formData, handleInputChange}) => {
    return (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Account Creation</h3>
          </div>
          <p className="text-sm text-muted-foreground">Set up login credentials for the student's account</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">This will be used for student login</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">Temporary password for first login</p>
            </div>
          </div>
        </div>
    )
}

export default CreateStudentAccount