'use client'

import { getConsultantCalendarAssignments } from '@/lib/querys'
import { Assignment } from '@/lib/types/types'
import { RootState } from '@/redux/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import StudentCalendar from '../students/[id]/StudentCalendar'

const page = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const user = useSelector((state: RootState) => state.user)

  useEffect(() => {
    getConsultantCalendarAssignments(user.id).then(setAssignments)
  }, [])

  useEffect(() => {
    console.log(assignments)
  }, [assignments])

  return (
    <>
      <StudentCalendar />
    </>
  )
}

export default page