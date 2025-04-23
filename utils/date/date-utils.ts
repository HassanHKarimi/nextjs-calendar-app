import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  addDays, 
  subDays, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth, 
  isToday,
  getHours,
  getMinutes
} from 'date-fns';

/**
 * Format a date as YYYY-MM-DD
 */
export const formatDateParam = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format a date for display in the month view
 */
export const formatMonthViewDate = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

/**
 * Format a date for display in the week view
 */
export const formatWeekViewDate = (date: Date): string => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
};

/**
 * Format a date for display in the day view
 */
export const formatDayViewDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

/**
 * Format a time for display
 */
export const formatEventTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

/**
 * Get the days of the month for a calendar view
 */
export const getCalendarDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
};

/**
 * Get the days of the week for a week view
 */
export const getWeekDays = (date: Date): Date[] => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  
  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  });
};

/**
 * Calculate position values for an event in hourly grid
 */
export const calculateEventPosition = (
  startDate: Date, 
  endDate: Date, 
  startHour: number = 7
): { top: number; height: number } => {
  const startHourValue = getHours(startDate) + (getMinutes(startDate) / 60);
  const endHourValue = getHours(endDate) + (getMinutes(endDate) / 60);
  
  const top = Math.max(0, (startHourValue - startHour) * 60); // startHour is the first hour in the grid
  const height = Math.min(14 * 60, (endHourValue - startHourValue) * 60); // 14 hours max in grid
  
  return { top, height };
};

/**
 * Navigation helpers
 */
export const getPreviousMonth = (date: Date): Date => subMonths(date, 1);
export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPreviousWeek = (date: Date): Date => subWeeks(date, 1);
export const getNextWeek = (date: Date): Date => addWeeks(date, 1);
export const getPreviousDay = (date: Date): Date => subDays(date, 1);
export const getNextDay = (date: Date): Date => addDays(date, 1);

/**
 * Check if a date is today
 */
export const isDateToday = (date: Date): boolean => isToday(date);

/**
 * Check if a date is in the current month
 */
export const isDateInMonth = (date: Date, month: Date): boolean => isSameMonth(date, month);

/**
 * Check if two dates are the same day
 */
export const isSameDayDate = (date1: Date, date2: Date): boolean => isSameDay(date1, date2); 