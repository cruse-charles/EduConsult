import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'

function AssignmentDetailModal({assignment, open, onOpenChange}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {assignment?.title}
          </DialogTitle>
          <DialogDescription>Assignment details and timeline</DialogDescription>
        </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default AssignmentDetailModal