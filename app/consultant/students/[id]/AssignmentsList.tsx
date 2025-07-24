'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BookOpen, ChevronDown, ChevronRight, Edit, FileText, Folder, FolderOpen, MoreHorizontal, Trash2, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";

import CustomToast from "@/app/components/CustomToast";
import StatusBadge from "@/app/components/StatusBadge";
import ViewAssignmentModal from "./ViewAssignmentModal/ViewAssignmentModal";
import CreateAssignmentModal from "./CreateAssignmentModal/CreateAssignmentModal";
import EditFolderModal from "./EditFolderModal";

import { deleteAssignmentSlice, renameFolderInStudentAssignmentsSlice } from "@/redux/slices/currentStudentAssignmentsSlice";
import { removeAssignmentDocId, removeFolder, renameFolderInStudentSlice } from "@/redux/slices/currentStudentSlice";
import { deleteDashboardAssignment } from "@/redux/slices/consultantAssignmentSlice";
import { completeStep } from "@/redux/slices/onboardingSlice";
import { setCurrentAssignment } from "@/redux/slices/currentAssignmentSlice";
import { AppDispatch, RootState } from "@/redux/store";

import { Assignment } from "@/lib/types/types";
import { formatDueDate } from "@/lib/utils";
import { deleteFolder, renameFolder } from "@/lib/assignmentUtils";
import { nextStep } from "@/lib/onBoardingUtils";

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import { Timestamp } from "firebase/firestore";

function AssignmentsList() {
    // Retrieve data from redux/URL
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const studentId = id as string
    const assignments = useSelector((state: RootState) => state.studentAssignments)
    const user = useSelector((state: RootState) => state.user)
    const folders = useSelector((state: RootState) => state.student.folders) || []
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding);

    // State to manage modal popup for folders
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)


    // State to manage which folders are open and sorting of folders/assignments
    const [openedFolders, setOpenedFolders] = useState<string[]>([])
    const [folderSort, setFolderSort] = useState("")
    const [assignmentSort, setAssignmentSort] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    // State for loading
    // const [loading, setLoading] = useState(true);

    // Sort assignments
    const getFilteredAssignments = (folder: string) => {
        if (!assignments) return []
        
        // Filter assignments by folder 
        let folderAssignments = assignments.filter((assignment: Assignment) => assignment.folder === folder)

        // Sort by assignment name
        if (assignmentSort === 'name') {
            folderAssignments.sort((a,b) => a.title.localeCompare(b.title))
        }

        // Sort by assignment dueDate
        if (assignmentSort === 'due') {
            folderAssignments.sort((a,b) => {
                const dataA = a.dueDate instanceof Timestamp ? a.dueDate.toDate() : a.dueDate as Date
                const dataB = b.dueDate instanceof Timestamp ? b.dueDate.toDate() : b.dueDate as Date
                return dataA.getTime() - dataB.getTime()
            })
        }

        // Sort by assignment status
        if (assignmentSort === 'status') {
            const statusOrder = ['Overdue', 'In-Progress', 'Submitted', 'Under Review', 'Completed']
            folderAssignments.sort((a,b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
        }

        return folderAssignments
    }

    // TODO: Finish this function
    const getCompletedCount = (assignmentsInFolder: Assignment[]) => {
        let count = 0
        // assignmentsInFolder.forEach((assignment) => assignment.status == 'Complete' ? count++ : null)
        return count
    }

    // Loading UI
    // if (loading) {
    //     return (
    //         Array.from({ length: 3 }).map((_, i) => (
    //             <Skeleton key={i} className="h-12 w-full rounded-md" />
    //         ))
    //     )
    // }

    // Function to sort folders
    const sortFolders = () => {
        let sortedFolders = [...folders]

        // Sort by folder name
        if (folderSort === 'name') {
            sortedFolders.sort((a,b) => a.localeCompare(b))
        }

        // Sort folders by earliest assignment dueDate
        if (folderSort === "due") {
            const now = new Date()

            sortedFolders.sort((a, b) => {
            const assignmentsA = getFilteredAssignments(a)
            const assignmentsB = getFilteredAssignments(b)

            // get soonest upcoming due date in folder A
            const soonestDueDateA = assignmentsA
                .map(assignment => {
                    if (assignment.dueDate instanceof Timestamp) return assignment.dueDate.toDate()
                    return assignment.dueDate as Date
                })
                .filter(dueDate => dueDate >= now) // ignore past due dates
                .sort((dueDate1, dueDate2) => dueDate1.getTime() - dueDate2.getTime())[0]

            // same for folder B
            const soonestDueDateB = assignmentsB
                .map(assignment => {
                    if (assignment.dueDate instanceof Timestamp) return assignment.dueDate.toDate()
                    return assignment.dueDate as Date
                })
                .filter(dueDate => dueDate >= now)
                .sort((dueDate1, dueDate2) => dueDate1.getTime() - dueDate2.getTime())[0]

            // handle cases where a folder has no future due dates
            if (!soonestDueDateA && !soonestDueDateB) return 0
            if (!soonestDueDateA) return 1
            if (!soonestDueDateB) return -1

            return soonestDueDateA.getTime() - soonestDueDateB.getTime()
            })
        }

        return sortedFolders
    }

    const sortedFolders = sortFolders()

    // Function to delete a folder and assignments within it
    const handleDeleteFolder = async (folderName: string) => {
        console.log('foldernmae', folderName)

        try {
            // Delete folder and assignments in database
            await deleteFolder(studentId, folderName)
            
            // Remove folder from redux, studentSlice
            dispatch(removeFolder(folderName))

            // Remove assignments from student slice, studentAssignmentsSlice, DashboardAssignmentsSlice
            const assignmentsInFolder = assignments.filter((assignment: Assignment) => assignment.folder == folderName)
            assignmentsInFolder.forEach((assignment) => {
                dispatch(removeAssignmentDocId(assignment.id))
                dispatch(deleteAssignmentSlice(assignment.id))
                dispatch(deleteDashboardAssignment(assignment.id))
            })
        } catch (error) {
            console.error("Error deleting folder:", error);
            toast(<CustomToast title='Error deleting folders.' description="" status='error'/>)
        }
            
    }

    // Function to edit folder name
    const handleEditFolder = async (oldFolderName: string, newFolderName: string) => {

        try {
            // Update folder in Firebase
            await renameFolder(studentId, oldFolderName, newFolderName)

            // Update folder in redux
            // TODO: UPDATE REDUX ON CONSULTANTDASHBOARD ASSIGNMENTS
            dispatch(renameFolderInStudentSlice({oldFolderName, newFolderName}))
            dispatch(renameFolderInStudentAssignmentsSlice({oldFolderName, newFolderName}))
        } catch (error) {
            console.error("Error renaming folder:", error);
            toast(<CustomToast title='Error renaming folders.' description="Please refresh and try again." status="error"/>)
        }
    }

    // Handle opening folders and onboarding if necessary
    const handleOpenFolder = async (folder: string) => {
        setOpenedFolders((prev: string[]) => prev.includes(folder) ? prev.filter((f) => f != folder) : [...prev, folder])
        if (!isComplete) {
            dispatch(completeStep("openFolder"))
            await nextStep(user.id)
        }
    }

    // Handle clicking assignment to open modal for details
    const handleAssignmentClick = async (assignment: Assignment) => {
        setIsModalOpen(true)

        dispatch(setCurrentAssignment(assignment))

        // Check if onboarding is complete for tooltip to render
        if (!isComplete) {
            dispatch(completeStep("viewAssignment"))
            await nextStep(user.id)
        }
    }

    return (
        <>
            {/* Sorting Controls */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort folders by:</span>
                    <Select value={folderSort} onValueChange={(value) => {setFolderSort(value); sortFolders()}}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="due">Closest Due Date</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort assignments by:</span>
                    <Select value={assignmentSort} onValueChange={(value) => setAssignmentSort(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="due">Due Date</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <CreateAssignmentModal/>
            </div>

            {/* List of Folders/Assignments */}
            <Card>
                <CardContent className="p-0">
                    <div className="space-y-2">
                        {sortedFolders?.map((folder) => (
                            <Collapsible
                                key={folder}
                                onOpenChange={() => handleOpenFolder(folder)}
                            >
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer border-b w-full h-auto folder">
                                        <div className="flex items-center gap-3">
                                            {openedFolders.includes(folder) ? (
                                                <FolderOpen className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Folder className="h-5 w-5 text-muted-foreground" />
                                            )}
                                            <div className="text-left">
                                                <h3 className="font-medium">{folder}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {/* TODO: Add handling for just 1 assignment or no completed assignments */}
                                                    {getFilteredAssignments(folder).length} assignments • {getCompletedCount(getFilteredAssignments(folder))} completed
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setSelectedFolder(folder)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Rename Folder
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={(e) => handleDeleteFolder(folder)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Folder
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {openedFolders.includes(folder) ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                <div className="space-y-1">
                                    {getFilteredAssignments(folder).map((assignment) => (
                                        <div onClick={() => handleAssignmentClick(assignment)} key={assignment.id} className="flex items-center justify-between p-4 pl-12 hover:bg-muted/30 cursor-pointer border-b border-muted assignment">   
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="flex items-center gap-2">
                                                    {assignment.type === "essay" && <FileText className="h-4 w-4 text-blue-500" />}
                                                    {assignment.type === "document" && <BookOpen className="h-4 w-4 text-green-500" />}
                                                    {assignment.type === "portfolio" && <Upload className="h-4 w-4 text-purple-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{assignment.title}</div>
                                                    <div className="text-sm text-muted-foreground">Due: {formatDueDate(assignment?.dueDate)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">{StatusBadge(assignment.status, assignment?.dueDate)}</div>
                                        </div>
                                    ))}
                                </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}      
                    </div>  
                </CardContent>
            </Card>
            <ViewAssignmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            <EditFolderModal open={!!selectedFolder} onOpenChange={(open: boolean) => !open && setSelectedFolder(null)} handleSave={handleEditFolder} oldFolderName={selectedFolder}/>
        </>
    )
}

export default AssignmentsList