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
            min-h-[346px]
            max-w-2xl grid-cols-1 items-center justify-around gap-4 gap-x-9
            sm:min-h-[25rem]
            sm:grid-cols-2
        `}
      >
        <aside>
          <h1 className="text-2xl uppercase">
            Avec toc-toc
            <br /> échangez des expériences, cours de langues, activitées notes
            des cours et des opportunités.
          </h1>
          <p>Connectez-vous pour voir toutes les offres d’échanges !</p>
        </aside>
        <aside>
          <ConnectionPanel />
        </aside>
      </div>
    </Banner>
  );
}
