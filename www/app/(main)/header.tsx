//

import { get_trpc } from ":trpc/server";
import { Grid } from "@1/ui/components/Grid";
import { Hydrate, dehydrate } from "@tanstack/react-query";

//

export default async function Outlet(props: any) {
  const trpc = await get_trpc();
  await trpc.profile.me.prefetch();

  const dehydratedState = dehydrate(trpc.queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Page {...props} />
    </Hydrate>
  );
}

export async function Page() {
  return (
    <div>
      <Grid className="items-center sm:grid-cols-[repeat(3,_auto)]">
        header
      </Grid>
    </div>
  );
}
