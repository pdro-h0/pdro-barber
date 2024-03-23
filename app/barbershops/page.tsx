import Header from "@/components/header";
import { db } from "@/lib/prisma";
import React from "react";
import BarbershopItem from "../(home)/components/barbershop-item";
import { redirect } from "next/navigation";
import Search from "../(home)/components/search";

interface BarbershopsProps {
  searchParams: {
    search?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsProps) => {
  if (!searchParams.search) {
    redirect("/");
  }
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });
  return (
    <>
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search />

        <h1 className="text-gray-400 font-bold text-xs uppercase">
          {`Resultado para "${searchParams.search}"`}
        </h1>

        <div className="flex justify-center flex-wrap gap-4">
          {barbershops.map(
            (barbershop: { id: React.Key | null | undefined }) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default BarbershopsPage;
