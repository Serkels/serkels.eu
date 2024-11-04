//

import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const Welcome_Flow = dynamic(() => import("./page.client"), {
  loading() {
    return <Spinner />;
  },
});

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Welcome :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1
        className={`
          my-0
          text-center text-6xl
          font-extrabold
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Welcome
      </h1>
      <div className="mx-auto mt-5 text-center">
        <Welcome_Flow />
      </div>
    </main>
  );
}
