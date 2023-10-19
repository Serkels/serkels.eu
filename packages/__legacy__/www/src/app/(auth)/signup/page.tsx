//

import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Sign Up :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <main className="col-span-full mx-auto flex h-full flex-col items-center justify-center space-y-5 text-2xl">
      <span className="">Vous êtes un :</span>
      <Link
        className="color-white rounded-full border-none bg-Cerulean px-5 py-2 font-bold text-white"
        href="/signup/user"
      >
        Étudiant
      </Link>
      <Link
        className="color-white rounded-full border-none bg-RedViolet px-5 py-2 font-bold text-white"
        href="/signup/partner"
      >
        Partenaire
      </Link>
    </main>
  );
}

//
