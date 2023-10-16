//

import { AuthError } from "@1.modules/core/errors";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const Verifying_Flow = dynamic(() => import("./page.client"), {
  ssr: false,
  loading() {
    return <Placeholder />;
  },
});

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

export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string | string[] | undefined };
}) {
  console.log(searchParams.error);
  if (typeof searchParams.error === "string") {
    throw new AuthError(searchParams.error);
  }

  return <Verifying_Flow />;
}

//

function Placeholder({}) {
  return (
    <main className="mx-auto text-center ">
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
        <Spinner />;
      </div>
    </main>
  );
}
