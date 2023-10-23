"use client";

import { Grid } from "@1.ui/react/grid";
import { Spinner } from "@1.ui/react/spinner";
import dynamic from "next/dynamic";

//

const Carousel = dynamic(() => import("@1.ui/react/carousel"), {
  ssr: false,
});

const ConnectionPanel = dynamic(() => import("./ConnectionPanel"), {
  ssr: false,
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
      <aside className="col-span-2 flex min-h-full items-center sm:col-span-4 md:col-start-2 xl:col-start-4">
        <Carousel className="h-full w-full" autoplay={true}>
          <article>
            <h1 className="mb-12 text-2xl font-bold uppercase">
              Avec toc toc échangez des expériences cours de langue activités
              notes de cours et profitez d autres services
            </h1>
            <p>Inscrivez-vous pour échanger entre pairs !</p>
          </article>
          <article>
            <h1 className="mb-6 text-2xl font-bold uppercase">
              Une question ? Posez la directement à la communauté sur la
              rubrique “forum”...
            </h1>
          </article>
          <article>
            <h1 className="mb-6 text-2xl font-bold uppercase">
              ... et ne ratez aucune opportunité proposée par nos partenaires
              bourses activités etc..​
            </h1>
          </article>
        </Carousel>
      </aside>
      <aside className="col-span-2 sm:col-span-2">
        <ConnectionPanel />
      </aside>
    </Grid>
  );
}
