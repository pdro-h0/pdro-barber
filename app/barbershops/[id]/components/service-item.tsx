"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale/pt-BR";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { generateDayTimeList } from "../../helpers/hours";
import { format } from "date-fns/format";
import { addDays } from "date-fns/addDays";
import { setMinutes } from "date-fns/setMinutes";
import { setHours } from "date-fns/setHours";
import { saveBooking } from "../../actions/save-booking";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getDayBookings } from "../../actions/get-day-bookings";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) => {
  const router = useRouter();
  const { data } = useSession();

  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [hour, setHour] = React.useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = React.useState<boolean>(false);
  const [sheetIsOpen, setSheetIsOpen] = React.useState<boolean>(false);
  const [dayBookings, setDayBookings] = React.useState<Booking[]>([]);

  useEffect(() => {
    if (!date) {
      return;
    }

    const refreshAvailablesHours = async () => {
      const _dayBooking = await getDayBookings(date, barbershop.id);
      setDayBookings(_dayBooking);
    };

    refreshAvailablesHours();
  }, [date, barbershop.id]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => {
    setHour(time);
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id,
      });

      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast("Reserva realizada com sucesso !", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH ':' mm", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  return (
    <Card>
      <CardContent className="p-3 max-[320px]:p-1 w-full ">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] max-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              style={{
                objectFit: "contain",
              }}
              alt={service.name}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-zinc-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    className="max-[320px]:p-1"
                    variant="secondary"
                    onClick={handleBookingClick}
                  >
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0 overflow-y-auto pb-5 [&::-webkit-scrollbar]:hidden">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-6 lg:py-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      className="rounded-md mt-6 lg:hidden"
                      locale={ptBR}
                      fromDate={addDays(new Date(), 1)}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      className="rounded-md mt-1 max-lg:hidden flex justify-center"
                      locale={ptBR}
                      fromDate={addDays(new Date(), 1)}
                    />
                  </div>

                  {date && (
                    <ScrollArea>
                      <div className="py-6 gap-3 px-5 border-t border-solid border-secondary flex overflow-auto [&::-webkit-scrollbar]:hidden">
                        {timeList.map((time) => (
                          <Button
                            variant={hour === time ? "default" : "outline"}
                            className="rounded-full "
                            onClick={() => handleHourClick(time)}
                            key={time}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="max-lg:hidden mt-2"
                      />
                    </ScrollArea>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {" "}
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-zinc-400 text-sm">Data</h3>
                            <h4 className="text-sm capitalize">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-zinc-400 text-sm">Horário</h3>
                            <h4 className="text-sm capitalize">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-zinc-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm capitalize">
                            {barbershop.name}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="px-5">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!hour || !date || submitIsLoading}
                      className="lg:w-full"
                    >
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar Reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
