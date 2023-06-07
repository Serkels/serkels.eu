"use client";

//

import { Banner } from "@1/ui/shell";
import { ConnectionPanel } from "./ConnectionPanel";

//

export function HomeBanner() {
  return (
    <Banner>
      <div
        className={`
          container
          m-auto
          grid
          min-h-[150vh]
          grid-cols-1 items-center justify-around gap-10
          sm:min-h-screen
          sm:grid-cols-12
          xl:min-h-min
        `}
      >
        <aside className="col-start-1 sm:col-end-8 lg:col-start-3">
          <h1 className="text-2xl uppercase">
            Avec toc-toc
            <br /> échangez des expériences, cours de langues, activitées notes
            des cours et des opportunités.
          </h1>
          <p>Connectez-vous pour voir toutes les offres d'échanges !</p>
        </aside>
        <aside className="sm:col-span-5 md:col-span-4">
          <ConnectionPanel />
        </aside>
      </div>
    </Banner>
  );
}
