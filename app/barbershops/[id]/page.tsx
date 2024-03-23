import { db } from "@/lib/prisma";
import React from "react";
import ServiceItem from "./components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BarbershopInfo from "./components/barbershop-info";
import Header from "@/components/header";

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
      <div className="max-lg:hidden">
        <Header />
      </div>
      
      <div className="lg:px-32">
        <BarbershopInfo barbershop={barbershop} />
        <div className="px-5 flex flex-col gap-4 py-6 lg:flex-row lg:flex-wrap lg:px-0">
          {barbershop.services.map(
            (service: { id: React.Key | null | undefined }) => (
              <ServiceItem
                key={service.id}
                barbershop={barbershop}
                service={service}
                isAuthenticated={!!session?.user}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
