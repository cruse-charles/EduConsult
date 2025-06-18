export const onboardingSteps = [
  {
    id: "Welcome",
    target: ".welcome-dashboard",
    content: "Welcome to your dashbaord! Let's show you around!",
    page: '1/9',
    path: '/consultant/dashboard'
  },
  {
    id: "create-student",
    target: ".create-student-btn",
    content: "Click Add Student to create your first student.",
    actionRequired: "studentCreated", // only advance after user clicks
    page: '2/9',
    path: '/consultant/dashboard'
  },
  {
    id: "click-student-profile",
    target: ".student-row",
    content: "Click your student's name to view your their proifle.",
    actionRequired: "fetchStudentProfile",
    page: '3/9',
    path: '/consultant/dashboard'
  },  
  {
    id: "click-create-assignment",
    target: ".create-assignment",
    content: "Create an assignment for a student.",
    actionRequired: "createAssignment",
    page: '4/9',
    path: '/consultant/students'
  },
  {
    id: "open-folder",
    target: ".folder",
    content: "Click a folder to open it and see assignments within.",
    actionRequired: "openFolder",
    page: '5/9',
    path: '/consultant/students'
  },
  {
    id: "view-assignment",
    target: ".assignment",
    content: "View your assignment details by clicking on the assignment you created.",
    actionRequired: "viewAssignment",
    page: '6/9',
    path: '/consultant/students'
  },
  {
    id: "create-entry",
    target: ".create-entry",
    content: "Provide feedback on the student's assignment here.",
    actionRequired: "createEntry",
    page: '7/9',
    path: '/consultant/students'
  },
  {
    id: "view-Assignments",
    target: ".view-assignments",
    content: "See a list of all your assignments.",
    actionRequired: "viewAssignments",
    page: '8/9',
    path: '/consultant/students'
  },
  {
    id: "view-Calendar",
    target: ".view-calendar",
    content: "See a calendar with your assignments.",
    actionRequired: "viewCalendar",
    page: '9/9',
    path: '/consultant/students'
  },
]
