export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string;
  isAllDay?: boolean;
  color?: string;
  start?: string | Date;  // For backward compatibility
  end?: string | Date;    // For backward compatibility
} 