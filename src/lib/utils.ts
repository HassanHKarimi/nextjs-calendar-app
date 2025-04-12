import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function formatDateRange(startDate: Date, endDate: Date, isAllDay: boolean): string {
  const sameDay = startDate.toDateString() === endDate.toDateString();
  
  if (sameDay) {
    if (isAllDay) {
      return `${formatDate(startDate)} (All day)`;
    }
    return `${formatDate(startDate)}, ${formatTime(startDate)} - ${formatTime(endDate)}`;
  }
  
  if (isAllDay) {
    return `${formatDate(startDate)} - ${formatDate(endDate)} (All day)`;
  }
  
  return `${formatDate(startDate)}, ${formatTime(startDate)} - ${formatDate(endDate)}, ${formatTime(endDate)}`;
}

export function getColorClass(color: string | null | undefined): string {
  switch (color) {
    case "blue":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/80 dark:text-blue-300 dark:border-blue-700";
    case "green":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/80 dark:text-green-300 dark:border-green-700";
    case "red":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/80 dark:text-red-300 dark:border-red-700";
    case "purple":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/80 dark:text-purple-300 dark:border-purple-700";
    case "yellow":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/80 dark:text-yellow-300 dark:border-yellow-700";
    case "indigo":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/80 dark:text-indigo-300 dark:border-indigo-700";
    case "pink":
      return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/80 dark:text-pink-300 dark:border-pink-700";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/80 dark:text-blue-300 dark:border-blue-700";
  }
}
