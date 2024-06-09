//

import { Suspense } from "react";
import get_categories from "./get_categories";
import PageClient from "./page.client";

//

export default async function Page() {
  const sdf = await get_categories();
  sdf;
  // console.log({ sdf });
  return (
    <div>
      Page
      <Suspense fallback="loading...">
        <PageClient />
      </Suspense>
    </div>
  );
}
