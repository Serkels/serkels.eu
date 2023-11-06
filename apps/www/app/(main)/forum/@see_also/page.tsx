//

import { StudientGuide } from ":components/StudientGuide";
import Link from "next/link";

//

export default function Page() {
  return (
    <article>
      <h2 className="mb-7 text-center  text-lg font-bold text-Congress_Blue">
        Voir aussi
      </h2>

      <Link href="/guide">
        <figure className="mx-auto w-fit">
          <StudientGuide />
        </figure>
      </Link>
    </article>
  );
}
