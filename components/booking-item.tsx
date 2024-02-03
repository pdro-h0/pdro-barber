import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Prisma } from "@prisma/client";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale/pt-BR";
import { isPast } from "date-fns/isPast";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingFinished = isPast(booking.date);

  return (
    <Card>
      <CardContent className="flex p-0">
        <div className="flex flex-col gap-2 pl-5 py-5 flex-[3]">
          <Badge
            className="w-fit"
            variant={isBookingFinished ? "secondary" : "default"}
          >
            {isBookingFinished ? "Finalizado" : "Confirmado"}
          </Badge>
          <h2 className="font-bold">{booking.service.name}</h2>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={booking.barbershop.imageUrl}
                alt={booking.barbershop.name}
              />
              <AvatarFallback>{booking.barbershop.name[0]}</AvatarFallback>
            </Avatar>

            <h3 className="text-sm">{booking.barbershop.name}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-l border-solid border-secondary flex-1">
          <p className="text-sm capitalize">
            {format(booking.date, "MMMM", {
              locale: ptBR,
            })}
          </p>
          <p className="text-2xl font-bold">{format(booking.date, "dd")}</p>
          <p className="text-sm">{format(booking.date, "hh:mm")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;
