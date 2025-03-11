import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDueDate = (dueDate: Date | Timestamp | undefined) => {
    if (!dueDate || dueDate === undefined) return "No due date";
    const date = dueDate instanceof Date ? dueDate : dueDate.toDate();
    return format(date, "MMM d, yyyy");
}

export const formatDueDateAndTime = (dueDate: Date | Timestamp | undefined) => {
    if (!dueDate || dueDate === undefined) return "No due date";
    const date = dueDate instanceof Date ? dueDate : dueDate.toDate();
    return format(date, "MMM d, yyyy 'at' h:mm a");
}