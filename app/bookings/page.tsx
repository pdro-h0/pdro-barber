import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import { getServerSession } from "next-auth";
import { db } from "@/lib/prisma";
import BookingItem from "@/components/booking-item";
import { isFuture } from "date-fns/isFuture";
import { isPast } from "date-fns/isPast";

const Bookings = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  });

  const confirmedBookings = bookings.filter((booking: { date: any }) =>
    isFuture(booking.date)
  );
  const finishedBookings = bookings.filter((booking: { date: any }) =>
    isPast(booking.date)
  );

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font">Agendamentos</h1>

        <h2 className="text-zinc-400 uppercase font-bold text-sm mt-6 mb-3">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map(
            (booking: { id: React.Key | null | undefined }) => (
              <BookingItem key={booking.id} booking={booking} />
            )
          )}
        </div>

        <h2 className="text-zinc-400 uppercase font-bold text-sm mt-8 mb-3">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedBookings.map(
            (booking: { id: React.Key | null | undefined }) => (
              <BookingItem key={booking.id} booking={booking} />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Bookings;
