'use client'

import { getConsultantCalendarAssignments } from '@/lib/querys'
import { Assignment } from '@/lib/types/types'
import { RootState } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

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
      <div>assignments</div>
      {assignments.map((assignment) => (
        <div>{assignment.title}</div>
      ))}
    </>
  )
}

export default page