//

import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Authorized :: ${(await parent).title?.absolute}`;

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
    <>
      <h1
        className={`
          mx-auto
          my-0
          text-center text-6xl
          font-extrabold
          text-green-100
          sm:text-7xl
          lg:text-8xl
        `}
      >
        Connexion par e-mail réussie 🪄
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-center">
        Votre adresse e-mail a été authentifiée avec succès. Vous allez être
        rediriger vers <Link href="/exchange">les échanges</Link>.
      </p>
    </>
  );
}
