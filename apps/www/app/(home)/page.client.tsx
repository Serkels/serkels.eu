"use client";

import { Grid } from "@1.ui/react/grid";
import { createHost, createSlot } from "create-slots";
import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

//

const Carousel = dynamic(() => import("@1.ui/react/carousel"), {
  ssr: false,
});

//
const Aside = createSlot("aside");

export default function HomeCarousel({ children }: PropsWithChildren) {
  return createHost(children, (Slots) => (
    <Grid className="min-h-[45vh] flex-1 items-center">
      <aside className="col-span-2 flex items-center px-[5%] sm:col-span-4 sm:px-0 md:col-start-2 md:min-h-full xl:col-start-4">
        <Carousel className="h-[18em] w-full" autoplay={true}>
          <article>
            <h1 className="mb-12 text-xl font-bold uppercase md:text-2xl">
              Avec Serkels,
              <br /> échangez des expériences, cours de langue, activités, notes
              de cours et profitez d'autres services.
            </h1>
            <p>Inscrivez-vous pour échanger entre pairs !</p>
          </article>
          <article>
            <h1 className="mb-6 text-xl font-bold uppercase md:text-2xl">
              Une question ? <br />
              posez-la directement à la communauté sur la rubrique “forum”...
            </h1>
          </article>
          <article>
            <h1 className="mb-6 text-xl font-bold uppercase md:text-2xl">
              ... et ne ratez aucune opportunité proposée par nos partenaires
              (bourses, activités etc...)​
            </h1>
          </article>
        </Carousel>
      </aside>
      <aside className="col-span-2 px-[5%] sm:col-span-2 sm:px-0">
        {Slots.get(Aside)}
      </aside>
    </Grid>
  ));
}

export const HomeCarousel__Aside = Aside;
