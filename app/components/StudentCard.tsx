import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function StudentCard({student}) {
    const { name, gpa} = student
  
    return (
        <Card>
            <CardHeader className="p-0">
                <div className="h-2 bg-black" />
            </CardHeader>
            <CardContent className="p-6">
            <div className="grid gap-1">
                <h3 className="font-semibold">{student.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">   
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                </div>
            </div>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default StudentCard