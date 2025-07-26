import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDueDate = (dueDate: any) => {
  if (!dueDate) return "No due date";

  let date: Date;

  if (dueDate instanceof Date) {
    // Already a Date
    date = dueDate;
  } else if (typeof dueDate.toDate === "function") {
    // Firestore Timestamp
    date = dueDate.toDate();
  } else if (
    typeof dueDate === "object" &&
    dueDate !== null &&
    "seconds" in dueDate
  ) {
    // Serialized Firestore Timestamp from Redux / JSON
    date = new Date(dueDate.seconds * 1000);
  } else {
    return "Invalid date";
  }

  return format(date, "MMM d, yyyy");
};

// Formatting date and time display
export const formatDueDateAndTime = (dueDate: Date | Timestamp | undefined) => {
  if (!dueDate || dueDate === undefined) return "No due date";
  const date = dueDate instanceof Date ? dueDate : dueDate.toDate();
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

// Formatting date display
export const formatNextDeadline = (nextDeadline: Date | Timestamp | undefined) => {
  if (!nextDeadline || nextDeadline === undefined) return "No upcoming deadlines";

  let date

  // if (date === undefined) return "No upcoming deadlines";

  if (nextDeadline instanceof Date) {
    // Already a Date
    date = nextDeadline;
  } else if (typeof nextDeadline.toDate === "function") {
    // Firestore Timestamp
    date = nextDeadline.toDate();
  } else if (
    typeof nextDeadline === "object" &&
    nextDeadline !== null &&
    "seconds" in nextDeadline
  ) {
    // Serialized Firestore Timestamp from Redux / JSON
    date = new Date(nextDeadline.seconds * 1000);
  } else {
    return "Invalid date";
  }
  return format(date, "MMM d, yyyy");
}

// Evaluate nextDeadline UI rendering
export const evaluateNextDeadline = (nextDeadline: Date | Timestamp | undefined) => {
  const now = new Date()

  if (!nextDeadline) return 'No upcoming deadline'
  
  if (nextDeadline < now) {
    return 'No upcoming deadline'
  } else {
    return formatNextDeadline(nextDeadline)
  }
}