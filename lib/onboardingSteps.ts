export const onboardingSteps = [
  {
    id: "Welcome",
    target: ".welcome-dashboard",
    content: "Let's take a quick tour of your dashboard to help you get started with managing your students and their applications.",
    page: '1/10',
    path: '/consultant/dashboard'
  },
  {
    id: "add-student-btn",
    target: ".add-student-btn",
    content: "Click Add Student to create your first student.",
    actionRequired: "clickAddStudentButton", // only advance after user clicks
    page: '2/10',
    path: '/consultant/dashboard'
  },
  {
    // TODO: MAKE COMPLETED STEPS DYNAMIC, STOP WITH THE NUMBERS, HAVE TO CHANGE IT EVERYWHERE FOR ONE MORE STEP, REFERENCE ACTION REQUIRED
    id: "create-student",
    target: ".create-student-modal",
    content: "Fill in the information and then click submit.",
    actionRequired: "clickSubmitCreateStudentButton", // only advance after user clicks
    page: '3/10',
    path: '/consultant/dashboard'
  },
  {
    id: "click-student-profile",
    target: ".student-row",
    content: "Click your student's name to view their proifle.",
    actionRequired: "fetchStudentProfile",
    page: '4/10',
    path: '/consultant/dashboard'
  },  
  {
    id: "click-create-assignment",
    target: ".create-assignment",
    content: "Create an assignment for a student.",
    actionRequired: "clickCreateAssignmentButton",
    page: '5/10',
    path: '/consultant/students'
  },
  {
    id: "open-folder",
    target: ".folder",
    content: "Click a folder to open it and see assignments within.",
    actionRequired: "openFolder",
    page: '6/10',
    path: '/consultant/students'
  },
  {
    id: "view-assignment",
    target: ".assignment",
    content: "View your assignment details by clicking on the assignment you created.",
    actionRequired: "viewAssignment",
    page: '7/10',
    path: '/consultant/students'
  },
  {
    id: "create-entry",
    target: ".create-entry",
    content: "Provide feedback on the student's assignment here.",
    actionRequired: "createEntry",
    page: '8/10',
    path: '/consultant/students'
  },
  {
    id: "view-Assignments",
    target: ".view-assignments",
    content: "See a list of all your assignments.",
    actionRequired: "viewAssignments",
    page: '9/10',
    path: '/consultant/students'
  },
  {
    id: "view-Calendar",
    target: ".view-calendar",
    content: "See a calendar with your assignments.",
    actionRequired: "viewCalendar",
    page: '10/10',
    path: '/assignments'
  },
]
