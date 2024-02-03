"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const cancelBoonking = async (bookingId: string) => {
  await db.booking.delete({
    where: {
      id: bookingId,
    },
  });

  revalidatePath("/bookings");
};
