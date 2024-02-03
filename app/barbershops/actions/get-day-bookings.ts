"use server";

import { db } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (date: Date, barbershopId: string) => {
  const bookings = await db.booking.findMany({
    where: {
      barbershopId: barbershopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });

  return bookings;
};
