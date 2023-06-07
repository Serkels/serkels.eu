"use client";

import Link from "next/link";

//

export function SeeAlso() {
  return (
    <article>
      <h2 className="mb-7 text-center  text-lg font-bold text-Congress_Blue">
        Voir aussi
      </h2>

      <Link href="/guide">
        <figure className="bg-secondary-blue-gradient px-4 py-6 text-white">
          <h3 className="text-center text-lg uppercase ">
            Le guide d'étudiant
          </h3>
          <div className="h-[110px]"></div>
          <figcaption className=" text-xs">
            Trouverez toutes les informations utiles pour bénéficier d'une
            bourse, faire une demande de logement, bénéficier d'aides …
          </figcaption>
        </figure>
      </Link>
    </article>
  );
}
