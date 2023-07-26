"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

//

export function FaqList() {
  const {} = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["faq"],
    queryFn: faq_query,
  });
  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  return (
    <ul className="grid grid-cols-1 gap-9">
      {data.map((exchange) => (
        <li key={exchange.id}>
          <ExchangeCard />
        </li>
      ))}
    </ul>
  );
}

async function faq_query() {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    date: new Date(i),
    user: { name: "foo" + i, location: "University" + i },
    isOnline: i % 3 === 0,
    location: "Location" + i,
    title: "Exchange Title" + i,
    description: "Exchange description" + i,
    category: "category" + i,
    seat: "seat" + i,
    maxRoom: "maxRoom" + i,
  }));
}

function ExchangeCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-white p-6 text-black shadow-[5px_5px_10px_#7E7E7E33]">
      <div className="">
        <header className="mb-4 flex justify-between">
          <figure className="flex">
            <img
              className="h-12 w-12 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <figcaption className="ml-2 mt-0.5">
              <span
                className="block text-base font-medium leading-snug text-black
        "
              >
                Yasmin Ibrahim
              </span>
              <span className="block text-sm font-light leading-snug text-gray-500 ">
                🎓 Université Lyon 3
              </span>
            </figcaption>
          </figure>
          <time className="mt-3 text-xs">02/09/2023</time>
        </header>
        <article>
          <h3 className="my-5 text-xl font-bold">
            Quel temps les étudiants consacrent-ils aux études ?
          </h3>
        </article>
      </div>
      <hr className="my-2" />
      <footer className="mt-4 ">
        <div className="flex justify-between">
          <button className="block text-sm font-bold text-Dove_Gray">
            <span className="text-Chateau_Green">1</span> réponse
          </button>
          <button className="text-md block  rounded-full px-7 font-bold text-Chateau_Green">
            Répondre
          </button>
          <button className="block">↗️</button>
        </div>
      </footer>
    </div>
  );
}
