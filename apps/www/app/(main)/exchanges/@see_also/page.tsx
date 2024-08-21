//

import List from ":app/(main)/opportunities/_client/List";
import Link from "next/link";

//

export default async function Page() {
  return (
    <article>
      <Link href="/opportunities">
        <h2 className="mb-7 text-center text-lg font-bold text-Congress_Blue">
          Voir aussi : Opportunités pros
        </h2>
        <List isAside={true} />
      </Link>
    </article>
  );
}
