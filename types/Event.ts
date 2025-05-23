import { Event as BaseEvent } from '@/utils/event/event-utils';

export interface Event extends BaseEvent {
  // Add animation support
  sourceElement?: HTMLElement;
  
  // Standardize date properties
  startDate?: Date;
  endDate?: Date;
  
  // Add additional properties for compatibility
  isAllDay?: boolean;
  color?: string;
}

export default Event; 