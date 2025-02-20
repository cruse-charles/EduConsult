import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

function StudentCard({student}) {
    const { name, gpa, pendingTasks, nextDeadline, progress} = student
    let nextDeadlineFormatted = nextDeadline ? nextDeadline.toDate().toLocaleDateString() : "No deadline set"
  
    return (
        <Card>
            <CardHeader className="p-0">
                <div className="h-2 bg-black" />
            </CardHeader>
            <CardContent className="p-6">
            <div className="grid gap-1">
                <h3 className="font-semibold">{name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">   
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                </div>
            </div>
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Application Progress</div>
                        <div className="text-sm text-muted-foreground">{progress}%</div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {pendingTasks} pending tasks
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {nextDeadlineFormatted}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/40 px-6 py-4">
                <Link href={`/students/${student.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                    View Profile
                </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default StudentCard