//

import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import Verifying_Flow from "./page.client";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Verifying :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const { token } = params;

  return (
    <>
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Vérification
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Suspense fallback={<Spinner />}>
          <Verifying_Flow token={token} />
        </Suspense>
      </div>
    </>
  );
}
