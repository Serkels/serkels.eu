//

import { Grid } from "@1/ui/components/Grid";
import type { Metadata, ResolvingMetadata } from "next";
import { type PropsWithChildren } from "react";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Exchange :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Layout({
  children,
  filter,
  see_also,
}: PropsWithChildren<{ filter: React.ReactNode; see_also: React.ReactNode }>) {
  return (
    <Grid>
      <aside className="my-10 hidden md:col-span-2 md:block xl:col-span-3">
        <div className="sticky top-[calc(theme(space.14)_+_theme(space.10))]">
          {filter}
        </div>
      </aside>
      <div className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        {children}
      </div>
      <aside className="my-10  hidden xl:col-span-3 xl:block xl:px-10">
        <div className="sticky top-[calc(theme(space.14)_+_theme(space.10))]">
          {see_also}
        </div>
      </aside>
    </Grid>
  );
}
