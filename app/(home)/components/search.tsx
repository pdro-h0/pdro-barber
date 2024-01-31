"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

const Search = () => {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Busque por uma Barbearia..." />

      <Button variant={"default"}>
        <SearchIcon size={20} />
      </Button>
    </div>
  );
};

export default Search;
