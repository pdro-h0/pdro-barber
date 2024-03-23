"use client"

import SideMenu from "@/components/side-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { Barbershop } from "@prisma/client";
import {
  ChevronLeft,
  MenuIcon,
  MapPinIcon,
  StarIcon,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  return (
    <div>
      <div className="w-full relative h-[250px] lg:hidden">
        <Link href="/">
          <Button
            size="icon"
            variant="outline"
            className="absolute top-4 left-4 z-50"
          >
            <ChevronLeft />
          </Button>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="z-50 absolute top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>

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

      <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
          className="opacity-75 max-lg:hidden w-full max-h-[485.9px] mt-10 rounded"
        />

      <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary lg:flex lg:justify-between lg:px-0">
        <div className="">
          <h1 className="text-xl font-bold lg:text-3xl">{barbershop.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <MapPinIcon className="text-primary" size={18} />
            <p className="text-sm">{barbershop.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2 lg:hidden">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">5,0 (899 avaliações)</p>
        </div>
        <Card className="flex flex-col items-center max-lg:hidden px-5 py-2">
          <span className="flex gap-2">
            <Star className="text-primary fill-primary" /> 5,0
          </span>
          <p className="text-sm">(899 avaliações)</p>
        </Card>
      </div>
    </div>
  );
};

export default BarbershopInfo;
