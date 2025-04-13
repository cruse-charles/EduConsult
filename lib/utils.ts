import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const formatDueDate = (dueDate: Date | Timestamp | undefined) => {
//     if (!dueDate || dueDate === undefined) return "No due date";
//     console.log('dueDate', dueDate)
//     const date = dueDate instanceof Date ? dueDate : dueDate.toDate();
//     return format(date, "MMM d, yyyy");
// }

export const formatDueDate = (dueDate: any) => {
  if (!dueDate) return "No due date";

  let date: Date;

  if (dueDate instanceof Date) {
    date = dueDate;
  } else if (typeof dueDate.toDate === "function") {
    date = dueDate.toDate();
  } else if ('seconds' in dueDate) {
    date = new Date(dueDate.seconds * 1000);
  } else {
    return "Invalid date";
  }

  return format(date, "MMM d, yyyy");
};

export const formatDueDateAndTime = (dueDate: Date | Timestamp | undefined) => {
    if (!dueDate || dueDate === undefined) return "No due date";
    const date = dueDate instanceof Date ? dueDate : dueDate.toDate();
    return format(date, "MMM d, yyyy 'at' h:mm a");
}

export const formatNextDeadline = (nextDeadline: Date | Timestamp | undefined) => {
    if (!nextDeadline || nextDeadline === undefined) return "N/A";
    const date = nextDeadline instanceof Date ? nextDeadline : nextDeadline.toDate();
    return format(date, "MMM d, yyyy");
}