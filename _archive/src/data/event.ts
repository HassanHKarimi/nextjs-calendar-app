import { db } from "@/lib/db";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export const getEventById = async (id: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id },
    });
    return event;
  } catch {
    return null;
  }
};

export const getEventsByUserId = async (userId: string) => {
  try {
    const events = await db.event.findMany({
      where: { userId },
      orderBy: { startDate: "asc" },
    });
    return events;
  } catch {
    return [];
  }
};

export const getEventsByDay = async (userId: string, date: Date) => {
  const start = startOfDay(date);
  const end = endOfDay(date);

  try {
    return await db.event.findMany({
      where: {
        userId,
        OR: [
          {
            // Event starts on this day
            startDate: {
              gte: start,
              lte: end,
            },
          },
          {
            // Event ends on this day
            endDate: {
              gte: start,
              lte: end,
            },
          },
          {
            // Event spans over this day
            AND: [
              {
                startDate: {
                  lt: start,
                },
              },
              {
                endDate: {
                  gt: end,
                },
              },
            ],
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });
  } catch {
    return [];
  }
};

export const getEventsByWeek = async (userId: string, date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 });

  try {
    return await db.event.findMany({
      where: {
        userId,
        OR: [
          {
            // Event starts in this week
            startDate: {
              gte: start,
              lte: end,
            },
          },
          {
            // Event ends in this week
            endDate: {
              gte: start,
              lte: end,
            },
          },
          {
            // Event spans over this week
            AND: [
              {
                startDate: {
                  lt: start,
                },
              },
              {
                endDate: {
                  gt: end,
                },
              },
            ],
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });
  } catch {
    return [];
  }
};

export const getEventsByMonth = async (userId: string, date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  try {
    return await db.event.findMany({
      where: {
        userId,
        OR: [
          {
            // Event starts in this month
            startDate: {
              gte: start,
              lte: end,
            },
          },
          {
            // Event ends in this month
            endDate: {
              gte: start,
              lte: end,
            },
          },
          {
            // Event spans over this month
            AND: [
              {
                startDate: {
                  lt: start,
                },
              },
              {
                endDate: {
                  gt: end,
                },
              },
            ],
          },
        ],
      },
      orderBy: { startDate: "asc" },
    });
  } catch {
    return [];
  }
};

export const createEvent = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    isAllDay: boolean;
    color?: string;
  }
) => {
  try {
    const event = await db.event.create({
      data: {
        ...data,
        userId,
      },
    });
    return event;
  } catch {
    return null;
  }
};

export const updateEvent = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    description?: string | null;
    startDate?: Date;
    endDate?: Date;
    location?: string | null;
    isAllDay?: boolean;
    color?: string | null;
  }
) => {
  try {
    const event = await db.event.update({
      where: {
        id,
        userId,
      },
      data,
    });
    return event;
  } catch {
    return null;
  }
};

export const deleteEvent = async (id: string, userId: string) => {
  try {
    await db.event.delete({
      where: {
        id,
        userId,
      },
    });
    return true;
  } catch {
    return false;
  }
};
