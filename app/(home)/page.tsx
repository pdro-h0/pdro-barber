import { db } from "@/lib/prisma";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

import Header from "@/components/header";
import Search from "./components/search";
import BookingItem from "@/components/booking-item";
import BarbershopItem from "./components/barbershop-item";
import { Key } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function Home() {
  const session = await getServerSession(authOptions)

  const barbershops = await db.barbershop.findMany({});

  const confirmedBookings = session?.user ? await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
      date: {
        gt: new Date()
      }
    },
    include: {
      service: true,
      barbershop: true,
    },
  }) : []

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, Miguel!</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6">
        <h2 className="pl-5 text-xs mb-3 uppercase text-zinc-400 font-bold">
          Agendamentos
        </h2>

        <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {confirmedBookings.map((booking: { id: Key | null | undefined; }) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-lg mb-3 uppercase text-zinc-400 font-bold">
          Recomendados
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: { id: Key | null | undefined; }) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className="px-5 text-lg mb-3 uppercase text-zinc-400 font-bold">
          Populares
        </h2>

        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: { id: Key | null | undefined; }) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
