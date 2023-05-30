"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { Exchange } from "@1/ui/icons";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

//

export function ExchangeList() {
  const {} = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["exchange"],
    queryFn: exchange_query,
  });
  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  return (
    <ul className="grid grid-cols-1 gap-8">
      {data.map((exchange) => (
        <li key={exchange.id} className="mx-auto xl:max-w-3xl">
          <ExchangeCard />
        </li>
      ))}
    </ul>
  );
}

async function exchange_query() {
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
    <div className="overflow-hidden rounded-xl bg-white text-black shadow-[5px_5px_10px_#7E7E7E33]">
      <div className="p-6">
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
                Alexandre Mollet
              </span>
              <span className="block text-sm font-light leading-snug text-gray-500 ">
                🎓 Université Paris 8
              </span>
            </figcaption>
          </figure>
          <time className="mt-3 text-xs">02/09/2023</time>
        </header>
        <hr className="my-2" />
        <div className="items-center justify-between text-xs text-[#707070] sm:flex">
          <div className="inline-flex">
            <span className="min-w-[100px] font-bold uppercase text-Eminence">
              Proposition
            </span>
            <span className="font-bold">📍En ligne</span>
          </div>
          <div className=" flex items-center justify-between">
            <span className="whitespace-nowrap font-bold uppercase">
              Cours de langes
            </span>
            <Exchange className="mx-1 w-5 text-Chateau_Green" />
            <span className="whitespace-nowrap font-bold">Sans échange</span>
          </div>
        </div>
        <hr className="my-2" />
        <article>
          <h3 className="my-5 text-2xl font-bold">
            Cours de français tout les niveau
          </h3>
          <p>
            Dans une licence LEA, vous étudiez deux langues los fige à un niveau
            égal, le plus souvent l'anglais et une autre langue, mais aussi des
            matières d'application. (Si vous vous inscrivez à une licence où
            vous apprenez deux langues autres que l'anglais, vous aurez des
            cours d'anglais en plus). Le but n'est pas seulement de
            perfectionner communication…
          </p>
        </article>
      </div>
      <footer className="mt-4 bg-Eminence px-5 py-3 text-white">
        <div className="flex justify-between">
          <button className="block">🔖</button>
          <button className="block rounded-full bg-Chateau_Green px-7 text-white">
            Demander
          </button>
          <button className="block">↗️</button>
        </div>
      </footer>
    </div>
  );
}
