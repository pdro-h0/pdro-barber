"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  search: z
    .string({ required_error: "Campo obrigatório!" })
    .trim()
    .min(1, "Campo obrigatório!"),
});

const Search = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?search=${data.search}`)
  };

  return (
    <div className="flex items-center gap-2">
      <Form {...form}>
        <form
          className="flex gap-4 w-full"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Busquq por uma barbearia..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant={"default"} type="submit">
            <SearchIcon size={20} />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Search;
