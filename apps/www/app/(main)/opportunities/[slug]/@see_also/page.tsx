//

import { TRPC_SSR } from ":trpc/server";
import { ErrorOccur } from "@1.ui/react/error";
import { SeeAlso_Provider } from "./context";
import Page_Client from "./page.client";

//

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const opportunity = await TRPC_SSR.opportunity.by_slug.fetch(slug);

    const {
      id,
      category: { slug: category },
    } = opportunity;

    return (
      <SeeAlso_Provider category={category} exclude_ids={[id]}>
        <Page_Client />
      </SeeAlso_Provider>
    );
  } catch (error) {
    return <ErrorOccur error={error as Error} />;
  }
}
