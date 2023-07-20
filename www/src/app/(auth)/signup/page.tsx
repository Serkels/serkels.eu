//

import type { Metadata } from "next";
import Link from "next/link";

//

export const metadata: Metadata = {
  title: "Sign Up _ Toc-Toc",
  description: "Sign Up",
};

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
