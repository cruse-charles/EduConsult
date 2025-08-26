import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Assignment } from "@/lib/types/types";

export function useSortedAssignments(assignments: Assignment[], folders: string[]) {
    const [folderSort, setFolderSort] = useState("")
    const [assignmentSort, setAssignmentSort] = useState("")

    const getFilteredAssignments = (folder: string): Assignment[] => {
        if (!assignments) return []

        let folderAssignments = assignments.filter((a: Assignment) => a.folder === folder)

        if (assignmentSort === 'name') {
            folderAssignments.sort((a, b) => a.title.localeCompare(b.title))
        }
        if (assignmentSort === 'due') {
            folderAssignments.sort((a, b) => {
                const dateA = a.dueDate instanceof Timestamp ? a.dueDate.toDate() : a.dueDate as Date
                const dateB = b.dueDate instanceof Timestamp ? b.dueDate.toDate() : b.dueDate as Date
                return dateA.getTime() - dateB.getTime()
            })
        }
        if (assignmentSort === 'status') {
            const statusOrder = ['Overdue', 'In-Progress', 'Submitted', 'Under Review', 'Completed']
            folderAssignments.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status))
        }

        return folderAssignments
    }

    const getCompletedCount = (assignmentsInFolder: Assignment[]) =>
        assignmentsInFolder.filter((a) => a.status === 'Completed').length

    const sortedFolders = (() => {
        let sorted = [...folders]

        if (folderSort === 'name') {
            sorted.sort((a, b) => a.localeCompare(b))
        }
        if (folderSort === 'due') {
            const now = new Date()
            sorted.sort((a, b) => {
                const getSoonest = (folder: string) =>
                    getFilteredAssignments(folder)
                        .map((a) => a.dueDate instanceof Timestamp ? a.dueDate.toDate() : a.dueDate as Date)
                        .filter((d) => d >= now)
                        .sort((d1, d2) => d1.getTime() - d2.getTime())[0]

                const soonestA = getSoonest(a)
                const soonestB = getSoonest(b)

                if (!soonestA && !soonestB) return 0
                if (!soonestA) return 1
                if (!soonestB) return -1
                return soonestA.getTime() - soonestB.getTime()
            })
        }

        return sorted
    })()

    return {
        folderSort, setFolderSort,
        assignmentSort, setAssignmentSort,
        sortedFolders,
        getFilteredAssignments,
        getCompletedCount,
    }
}