import { db } from "@/lib/prisma";
import React from "react";
import ServiceItem from "./components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BarbershopInfo from "./components/barbershop-info";

interface BarbershopDetailsPageProps {
  params: {
    id: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    //TODO redirecionar para home
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    //TODO redirecionar para home
    return null;
  }
  return (
    

    <div>
    <BarbershopInfo barbershop={barbershop} />

    <div className="px-5 flex flex-col gap-4 py-6">
      {barbershop.services.map((service: { id: React.Key | null | undefined; }) => (
        <ServiceItem key={service.id} barbershop={barbershop} service={service} isAuthenticated={!!session?.user} />
      ))}
    </div>
  </div>
  );
};

export default BarbershopDetailsPage;
