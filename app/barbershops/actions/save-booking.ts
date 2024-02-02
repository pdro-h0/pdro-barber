import { db } from "@/lib/prisma";

interface saveBookingParams {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export const saveBooking = async (params: saveBookingParams) => {
  await db.booking.create({
    data: {
      serviceId: params.serviceId,
      barbershopId: params.barbershopId,
      userId: params.userId,
      date: params.date,
    },
  });
};
