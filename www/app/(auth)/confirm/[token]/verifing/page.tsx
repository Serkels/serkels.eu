//

import { Spinner } from "@1/ui/components/Spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const Verifying_Flow = dynamic(() => import("./page.client"), {
  ssr: false,
  loading() {
    return <Spinner />;
  },
});

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Verifying :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({ params }: { params: { token: string } }) {
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
        <Verifying_Flow token={token} />
      </div>
    </>
  );
}
