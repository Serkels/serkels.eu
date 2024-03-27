//

import type { Metadata, ResolvingMetadata } from "next";
import { ReportForm } from "./page.client";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Report :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default function Page() {
  return (
    <main className="container prose mx-auto my-32 lg:prose-xl">
      <h1>Signalement</h1>

      <ReportForm />
    </main>
  );
}
