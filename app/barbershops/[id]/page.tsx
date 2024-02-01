import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ChevronLeft, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ServiceItem from "./components/service-item";

interface BarbershopDetailsPageProps {
  params: {
    id: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
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
      <div className="w-full relative h-[250px]">
        <Link href="/">
          <Button
            size="icon"
            variant="outline"
            className="absolute top-4 left-4 z-50"
          >
            <ChevronLeft />
          </Button>
        </Link>

        <Button
          size="icon"
          variant="outline"
          className="absolute top-4 right-4 z-50"
        >
          <MenuIcon />
        </Button>

        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{
            objectFit: "cover",
          }}
          className="opacity-75"
        />
      </div>

      <div className="px-5 py-3 pb-6 border-b border-sloid border-secondary">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>

        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon className="stroke-primary" />
          <p className="text-sm">{barbershop.address}</p>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="fill-primary stroke-transparent" />
          <p className="text-sm">5,0 (899 avaliações)</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem service={service} key={service.id} />
        ))}
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
