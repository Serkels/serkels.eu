"use client";

//

import { Banner } from "@1/ui/shell";
import { ConnectionPanel } from "./ConnectionPanel";

//

export function HomeBanner() {
  return (
    <Banner>
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
    </Banner>
  );
}
