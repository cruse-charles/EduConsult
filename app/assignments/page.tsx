'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MoreHorizontal, Trash2 } from 'lucide-react'

import { formatNextDeadline } from '@/lib/utils'

import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Assignment } from '@/lib/types/types'

import StatusBadge from '../components/StatusBadge'
import { openCurrentAssignmentModal, setCurrentAssignment } from '@/redux/slices/currentAssignmentSlice'
import ReadAssignmentModal from '../consultant/students/[id]/ReadAssignmentModal/ReadAssignmentModal'
import { Button } from '@/components/ui/button'
import CreateAssignmentModal from '../consultant/students/[id]/CreateAssignmentModal/CreateAssignmentModal'
import { fetchAssignments } from '@/redux/slices/assignmentsSlice'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// TODO: Add loading state
// TOOOOOOOOOODOOOOOOOOOOOOOOOOOOOOOOOOOO: clean up comments and stuff, and double check loading more logic
const page = () => {
    const dispatch = useDispatch()

    // Retrieve user details and assignment state
    const user = useSelector((state: RootState) => state.user)
    const assignments = useSelector((state: RootState) => state.assignments.data)
    const {loading, error} = useSelector((state: RootState) => state.assignments)
    const hasMore = useSelector((state: RootState) => state.assignments.pagination.hasMore)
    const [loadMore, setLoadMore] = useState(false)

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchAssignments({ userId: user.id, loadMore: false, role: user.system.role }))
    }, [dispatch, user.id])

    const handleAssignmentClick = (assignment: Assignment) => {
        dispatch(openCurrentAssignmentModal())
        dispatch(setCurrentAssignment(assignment))
    }

    const handleLoadMore = () => {
        if (!hasMore) return
        // @ts-ignore
        dispatch(fetchAssignments({ userId: user.id, loadMore: true, role: user.system.role }))
    }


  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex-1 p-4 md:p-6 space-y-6">
        <h1>Manage Assignments</h1>
        <CreateAssignmentModal />
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none"
                >
                  Assignment 
                </TableHead>
                <TableHead>
                  {user.system.role === 'consultant' ? 'Student' : 'Consultant'}
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                >
                  Status 
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                >
                  Due Date
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : assignments.map((assignment) => (
                <TableRow
                  key={assignment.id}
                  onClick={() => handleAssignmentClick(assignment)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>
                    {user.system.role === 'consultant'
                      ? `${assignment.studentFirstName} ${assignment.studentLastName}`
                      : `${assignment.consultantFirstName} ${assignment.consultantLastName}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {assignment.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    {StatusBadge(assignment.status, assignment.dueDate)}
                  </TableCell>
                  <TableCell>{formatNextDeadline(assignment.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!loading && assignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No assignments found.</p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadMore}
            >
              {loadMore ? 'Loading…' : 'Load more'}
            </Button>
          </div>
        )}
      </main>
      <ReadAssignmentModal />
    </div>
  )
}

export default page