"use client";

import React from "react";

import { Card, CardContent } from "./ui/card";

import Link from "next/link";

import { Button } from "./ui/button";

import { Calendar, MenuIcon, User } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./ui/alert-dialog";

const Header = () => {
  const { data } = useSession();

  const handleLogin = async () => {
    await signIn("google");
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Card>
      <CardContent className="p-5 flex justify-between items-center lg:px-32">
        <Link href={"/"}>
          <Image
            src="/logo.png"
            alt="Logo da PDR Barber"
            height={30}
            width={170}
          />
        </Link>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="h-8 w-8">
                <MenuIcon size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
        </div>

        <div className="max-md:hidden flex gap-6">
          <Button variant={"outline"} >
            <Link href="/bookings" className="flex gap-2">
              <Calendar /> Agendamentos
            </Link>
          </Button>

          {data?.user ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"ghost"} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      className="w-9 h-9 rounded-full"
                      src={data.user?.image ?? ""}
                    />
                  </Avatar>
                  <h2 className="font-bold">{data.user.name}</h2>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="flex flex-col items-center w-[318px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">SAIR</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deseja deslogar da plataforma?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex w-full">
                  <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="flex-1">Sair</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button className="flex gap-2" onClick={handleLogin}>
              <User /> Perfil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
