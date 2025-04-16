import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface AssignmentCalendarProps {
    dueDate: Date | undefined;
    setDueDate: (date: Date | undefined) => void;
}

function AssignmentCalendar({dueDate, setDueDate}: AssignmentCalendarProps) {
    return (
        <>
                <div className="space-y-2">
                    <Label>Due Date  <span className="text-red-500">*</span></Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dueDate && "text-muted-foreground",
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                        </PopoverContent>
                    </Popover>
                </div>
        </>
    )
}

export default AssignmentCalendar