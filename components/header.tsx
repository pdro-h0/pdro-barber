"use client";

import React from "react";

import { Card, CardContent } from "./ui/card";

import Link from "next/link";

import { Button } from "./ui/button";

import { MenuIcon } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";

const Header = () => {
  return (
    <Card>
      <CardContent className="p-5 flex justify-between items-center">
        <Link href={"/"}>LOGO</Link>

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
      </CardContent>
    </Card>
  );
};

export default Header;
