"use client";

import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Prisma } from "@prisma/client";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale/pt-BR";
import { isPast } from "date-fns/isPast";
import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBoonking } from "@/app/actions/cancel-bookings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const isBookingFinished = isPast(booking.date);

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);

    try {
      await cancelBoonking(booking.id);

      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full cursor-pointer">
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
      </SheetTrigger>

      <SheetContent className="px-0">
        <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative w-full mt-6 h-[180px]">
            <Image
              src="/barbershop-map.png"
              fill
              sizes="100vw"
              alt={booking.barbershop.name}
            />
            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div className="w-[77%] ">
                    <h2 className="font-bold overflow-hidden text-nowrap text-ellipsis">
                      {booking.barbershop.name}
                    </h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge
            className="w-fit mt-3 my-3"
            variant={isBookingFinished ? "secondary" : "default"}
          >
            {isBookingFinished ? "Finalizado" : "Confirmado"}
          </Badge>

          <Card>
            <CardContent className="p-3 flex flex-col gap-3">
              <div className="flex justify-between">
                <h2 className="font-bold">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">
                  {" "}
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </h3>
              </div>

              <div className="flex justify-between">
                <h3 className="text-zinc-400 text-sm">Data</h3>
                <h4 className="text-sm capitalize">
                  {format(booking.date, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-zinc-400 text-sm">Horário</h3>
                <h4 className="text-sm capitalize">
                  {format(booking.date, "hh:mm")}
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-zinc-400 text-sm">Barbearia</h3>
                <h4 className="text-sm capitalize">
                  {booking.barbershop.name}
                </h4>
              </div>
            </CardContent>
          </Card>

          <SheetFooter className="w-full flex-row gap-3 mt-6 flex-wrap">
            <SheetClose asChild>
              <Button variant="secondary" className="w-full flex-1">
                Voltar
              </Button>
            </SheetClose>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isBookingFinished || isDeleteLoading}
                  variant="destructive"
                  className="w-full flex-1"
                >
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deseja mesmo cancelar esta reserva?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Uma vez cancelada, não será possível reverter esta ação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-3 ">
                  <AlertDialogCancel className="mt-0 flex-1">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelClick}
                    className="flex-1"
                  >
                    {isDeleteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
