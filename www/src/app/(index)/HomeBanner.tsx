//

import { Grid } from "@1/ui/components/Grid";
import { Banner } from "@1/ui/shell";
import { ConnectionPanel } from "./ConnectionPanel";

//

export function HomeBanner() {
  return (
    <Banner>
      <Grid className="items-center">
        <aside className="col-span-2 sm:col-span-4 md:col-start-2 xl:col-start-4">
          <h1 className="mb-6 text-xl font-bold uppercase">
            Avec toc-toc
            <br /> échangez des expériences, cours de langues, activitées notes
            des cours et des opportunités.
          </h1>
          <p>Connectez-vous pour voir toutes les offres d'échanges !</p>
        </aside>
        <aside className="col-span-2 sm:col-span-2">
          <ConnectionPanel />
        </aside>
      </Grid>
    </Banner>
  );
}
