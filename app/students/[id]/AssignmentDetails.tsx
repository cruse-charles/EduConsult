import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { updateAssignment } from '@/lib/assignmentUtils'
import { Assignment } from '@/lib/types/types'
import { cn, formatDueDate } from '@/lib/utils'
import { updateAssignmentSlice } from '@/redux/slices/assignmentsSlice'
import { format } from 'date-fns'
import { CalendarIcon, Clock, FileText, Pencil, Save, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

interface AssignmentDetailProps {
    assignment?: Assignment
}

function AssignmentDetails({assignment}: AssignmentDetailProps) {
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        type: assignment?.type,
        status: assignment?.status,
        dueDate: assignment?.dueDate,
        note: assignment?.note
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }

    useEffect(() => {
        console.log(assignment)
    }, [])

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch(updateAssignmentSlice({assignmentId: assignment?.id, updateData: formData }))
        await updateAssignment(formData, assignment?.id)

        setEdit(false)
    }

    const handleCancel = () => {
        // Reset form data to original values
        
        setFormData({
            type: assignment?.type,
            status: assignment?.status,
            dueDate: assignment?.dueDate,
            note: assignment?.note
        })
        setEdit(false)
    }

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            dueDate: date
        }))
    }
    
    return (

         <>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Assignment Overview</h4>
                    {!edit && (
                        <Button variant="outline" size="sm" onClick={() => setEdit(true)}className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </div>

                {edit ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select assignment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Essay">Essay</SelectItem>
                                    <SelectItem value="Document">Document</SelectItem>
                                    <SelectItem value="Portfolio">Portfolio</SelectItem>
                                    <SelectItem value="Application">Application</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">Submitted</SelectItem>
                                    <SelectItem value="Under Review">Under Review</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            {/* <Input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                            /> */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !assignment?.dueDate && "text-muted-foreground",
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {/* {assignment?.dueDate ? format(assignment?.dueDate, "PPP") : "Pick a date"} */}
                                    {formatDueDate(formData?.dueDate)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={assignment?.dueDate} onSelect={handleDateChange} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Instructions</Label>
                            <Textarea
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Assignment instructions..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading} className="gap-2">
                                <Save className="h-4 w-4" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Student:</span>
                            <span className="text-sm">{assignment?.student}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Type:</span>
                            <Badge variant="outline">{assignment?.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Status:</span>
                            <Badge variant={assignment?.status === "Completed" ? "default" : "outline"}>
                                {assignment?.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Due Date:</span>
                            <span className="text-sm">{formatDueDate(assignment?.dueDate)}</span>
                        </div>
                    </div>
                )}
            </div>
            
            <Separator />

            {!edit && (
                <div className="space-y-3">
                    <h4 className="font-medium">Instructions</h4>
                    <div className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm">{assignment?.note}</p>
                    </div>
                </div>
            )}
        </>
















        // <>
        //     <div className="space-y-3">
        //         <h4 className="font-medium">Assignment Overview</h4>
        //         <Button className='h-5 w-5' onClick={() => setEdit(true)}><Pencil /></Button>
        //         <div className="space-y-2">
        //             <div className="flex items-center gap-2">
        //                 <User className="h-4 w-4 text-muted-foreground" />
        //                 <span className="text-sm font-medium">Student:</span>
        //                 <span className="text-sm">{assignment?.student}</span>
        //             </div>
        //             <div className="flex items-center gap-2">
        //                 <FileText className="h-4 w-4 text-muted-foreground" />
        //                 <span className="text-sm font-medium">Type:</span>
        //                 <Badge variant="outline">{assignment?.type}</Badge>
        //             </div>
        //             <div className="flex items-center gap-2">
        //                 <Clock className="h-4 w-4 text-muted-foreground" />
        //                 <span className="text-sm font-medium">Status:</span>
        //                 <Badge variant={assignment?.status === "completed" ? "default" : "outline"}>
        //                     {assignment?.status === "completed" ? "Completed" : assignment?.status}
        //                 </Badge>
        //             </div>
        //             <div className="flex items-center gap-2">
        //                 <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        //                 <span className="text-sm font-medium">Due Date:</span>
        //                 <span className="text-sm">{formatDueDate(assignment?.dueDate)}</span>
        //             </div>
        //         </div>
        //     </div>
            
        //     <Separator />

        //     <div className="space-y-3">
        //         <h4 className="font-medium">Instructions</h4>
        //         <div className="p-3 bg-muted/50 rounded-md">
        //             <p className="text-sm">{assignment?.note}</p>
        //         </div>
        //     </div>
        // </>
    )
}

export default AssignmentDetails