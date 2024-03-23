import { db } from "@/lib/prisma";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import Header from "@/components/header";
import Search from "./components/search";
import BookingItem from "@/components/booking-item";
import BarbershopItem from "./components/barbershop-item";
import { Key } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const barbershops = await db.barbershop.findMany({});

  const confirmedBookings = session?.user
    ? await db.booking.findMany({
        where: {
          userId: (session.user as any).id,
          date: {
            gt: new Date(),
          },
        },
        include: {
          service: true,
          barbershop: true,
        },
      })
    : [];

  return (
    <div>
      <Header />

      <div className="lg:flex gap-32 lg:px-32 relative lg:pb-16 ">
        <div className="max-lg:hidden bg-[url('/bg-home.png')] bg-no-repeat bg-cover bg-bottom brightness-50 absolute top-0 left-0 h-full w-full" />
        {/* <Image
        src="/bg-home.png"
        style={{
          objectFit: "cover",
        }}
        alt="fundo da home"
        fill
        sizes="100vw"
        className=" z-50"/> */}

        <div className="lg:z-50 lg:flex-1">
          <div className="px-5 pt-5">
            <h2 className="text-xl font-bold">
              {session?.user
                ? `Olá, ${session.user.name?.split(" ")[0]}!`
                : "Olá! Vamos agendar um corte?"}
            </h2>
            <p className="capitalize text-sm">
              {format(new Date(), "EEEE',' dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
          </div>
          <div className="px-5 mt-6">
            <Search />
          </div>
          {confirmedBookings.length > 0 && (
            <div className="mt-6">
                <h2 className="pl-5 text-xs mb-3 uppercase text-zinc-400 font-bold">
                  Agendamentos
                </h2>
                <ScrollArea>
                <div className="px-5 flex gap-3 max-lg:overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {confirmedBookings.map(
                    (booking: { id: Key | null | undefined }) => (
                      <BookingItem booking={booking} key={booking.id} />
                    )
                  )}
                </div>
                <ScrollBar orientation="horizontal" className="max-lg:hidden mt-2" />
            </ScrollArea>
              </div>
          )}
        </div>

        <div className="lg:z-50 lg:flex-1 ">
          <div className="mt-6">
            <h2 className="max-md:px-5 text-lg mb-3 uppercase text-zinc-400 font-bold">
              Recomendados
            </h2>
            <div className="lg:hidden flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {barbershops.map((barbershop: { id: Key | null | undefined }) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>

            <Carousel className="max-lg:hidden">
              <CarouselContent className=" w-[314px] [&::-webkit-scrollbar]:hidden">
                {barbershops.map(
                  (barbershop: { id: Key | null | undefined }) => (
                    <CarouselItem className="basis-2/3" key={barbershop.id}>
                      <BarbershopItem barbershop={barbershop} />
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
              <CarouselPrevious className="" />
              <CarouselNext className="" />
            </Carousel>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem] lg:px-32">
        <h2 className="max-lg:px-5 text-lg mb-3 uppercase text-zinc-400 font-bold">
          Populares
        </h2>

        <div className="lg:hidden flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: { id: Key | null | undefined }) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <Carousel className="max-lg:hidden">
          <CarouselContent className="[&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop: { id: Key | null | undefined }) => (
              <CarouselItem className="basis-1/4 min-[1440px]:basis-1/5 min-[2560px]:basis-1/12" key={barbershop.id}>
                <BarbershopItem barbershop={barbershop} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="" />
          <CarouselNext className="" />
        </Carousel>
      </div>
    </div>
  );
}
