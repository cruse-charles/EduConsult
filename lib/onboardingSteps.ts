export const onboardingSteps = [
  {
    id: "Welcome",
    target: ".welcome-dashboard",
    content: "Let's take a quick tour of your dashboard to help you get started with managing your students and their applications.",
    page: '1/12',
    path: '/consultant/dashboard'
  },
  {
    id: "add-student-btn",
    target: ".add-student-btn",
    content: "Click Add Student to create your first student.",
    actionRequired: "clickAddStudentButton", // only advance after user clicks
    page: '2/12',
    path: '/consultant/dashboard'
  },
  {
    id: "create-student",
    target: ".create-student-modal",
    content: "Fill in the information and then click submit.",
    actionRequired: "clickSubmitCreateStudentButton", // only advance after user clicks
    page: '3/12',
    path: '/consultant/dashboard'
  },
  {
    id: "click-student-profile",
    target: ".student-row",
    content: "Click your student's name to view their proifle.",
    actionRequired: "fetchStudentProfile",
    page: '4/12',
    path: '/consultant/dashboard'
  },  
  {
    id: "click-create-assignment",
    target: ".create-assignment-btn",
    content: "Create an assignment for a student.",
    actionRequired: "clickCreateAssignmentButton",
    page: '5/12',
    path: '/consultant/students'
  },  
  {
    id: "create-assignment",
    target: ".create-assignment-modal",
    content: "Fill in the information for an assignment and create a folder for the its corresponding school, then click Create Assignment!",
    actionRequired: "createAssignment",
    page: '6/12',
    path: '/consultant/students'
  },
  {
    id: "open-folder",
    target: ".folder",
    content: "Click a folder to open it and see assignments within.",
    actionRequired: "openFolder",
    page: '7/12',
    path: '/consultant/students'
  },
  {
    id: "view-assignment",
    target: ".assignment",
    content: "View your assignment details by clicking on the assignment you created.",
    actionRequired: "viewAssignment",
    page: '8/12',
    path: '/consultant/students'
  },
  {
    id: "create-entry",
    target: ".create-entry",
    content: "Provide feedback on the student's assignment or return a revised document, then click here. A timeline of this assignment will be updated for both you and the student.",
    actionRequired: "createEntry",
    page: '9/12',
    path: '/consultant/students'
  },
  {
    id: "view-Tabs",
    target: ".view-tabs",
    content: "Click here to see a weekly calendar for this student's assigments and check out their personal info.",
    actionRequired: "viewTabs",
    page: '10/12',
    path: '/consultant/students'
  },
  {
    id: "view-Assignments",
    target: ".view-assignments-SideBar",
    content: "See a list of all your assignments.",
    actionRequired: "viewAssignments",
    page: '11/12',
    path: '/consultant/students'
  },
  {
    id: "view-Calendar",
    target: ".view-calendar",
    content: "See a calendar with your assignments.",
    actionRequired: "viewCalendar",
    page: '12/12',
    path: '/consultant/students'
  },
]
