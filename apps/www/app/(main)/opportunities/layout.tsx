///

import { AsideFilter } from ":components/shell/AsideFilter";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Grid } from "@1.ui/react/grid";
import { Suspense, type PropsWithChildren } from "react";
import { match } from "ts-pattern";

import { Categories_Filter } from "./_client/Categories_Filter";
import { Partner_Opportunities_Filter } from "./_client/Partner_Opportunities_Filter";
import SearchForm from "./_client/SearchForm";
import Loading from "./loading";

//

export default async function Layout({ children }: PropsWithChildren<{}>) {
  await TRPC_SSR.category.opportunity.prefetch();

  return (
    <TRPC_Hydrate>
      <Grid>
        <AsideFilter
          className="col-span-2 sm:col-span-6 md:col-span-2 md:block lg:col-span-2 xl:col-span-3"
          slot-title="Opportunités"
          subtitle="Trouvez les opportunités professionnelles dédiées aux étudiant.e.s"
        >
          <Suspense fallback={<Loading />}>
            <SearchForm />
          </Suspense>
          <User_Opportunities_Filter />
          <hr className="my-5 md:my-10" />
          <Categories_Filter />
        </AsideFilter>

        <div className="col-span-full md:col-span-6 xl:col-span-9">
          {children}
        </div>
      </Grid>
    </TRPC_Hydrate>
  );
}

async function User_Opportunities_Filter() {
  const session = await getServerSession();

  if (!session) return null;

  const role = session.profile.role;

  return await match({ role })
    .with({ role: PROFILE_ROLES.Enum.PARTNER }, async () => {
      return <Partner_Opportunities_Filter />;
    })
    .otherwise(() => null);
}
