"use client";

import { Grid } from "@1.ui/react/grid";
import { Spinner } from "@1.ui/react/spinner";
import dynamic from "next/dynamic";

//

const Carousel = dynamic(() => import("@1.ui/react/carousel"));

const ConnectionPanel = dynamic(() => import("./ConnectionPanel"), {
  loading: () => (
    <section className="text-center">
      <Spinner />
    </section>
  ),
});

//

export default function HomeCarousel() {
  return (
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
              posez-la directement à la communauté sur la rubrique
              “discussions”...
            </h1>
          </article>
          <article>
            <h1 className="mb-6 text-xl font-bold uppercase md:text-2xl">
              ... et ne ratez aucune opportunité pro proposée par nos
              partenaires (bourses, activités etc...)​
            </h1>
          </article>
        </Carousel>
      </aside>
      <aside className="col-span-2 px-[5%] sm:col-span-2 sm:px-0">
        <ConnectionPanel />
      </aside>
    </Grid>
  );
}
