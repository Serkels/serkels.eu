import { Grid } from "@1.ui/react/grid";

//
//
//
export function CarouselPlaceholder() {
  return (
    <Grid className="min-h-[45vh] items-center">
      <aside className="col-span-2 sm:col-span-4 md:col-start-2 xl:col-start-4">
        <h1 className="mb-12 text-2xl font-bold uppercase">
          Avec Serkels échangez des expériences cours de langue activités notes
          de cours et profitez d'autres services
        </h1>
        <p>Inscrivez-vous pour échanger entre pairs !</p>
      </aside>
      <aside className="col-span-2 sm:col-span-2"></aside>
    </Grid>
  );
}
