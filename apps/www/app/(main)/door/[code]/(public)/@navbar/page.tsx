//

import type { CodeParms } from ":pipes/code";
import Link from "next/link";
import { tv } from "tailwind-variants";

export default function Page({ params }: { params: CodeParms }) {
  const { code } = params;
  const { base, link } = style();
  return (
    <nav className={base()}>
      <div className="flex items-center">
        <Link className={link()} href={`/@${code}`}>
          À propos
        </Link>
        <Link className={link()} href={`/@${code}/proposals`}>
          Propositions
        </Link>
        <Link className={link()} href={`/@${code}/history`}>
          Échanges
        </Link>
      </div>

      <div className="flex items-center">
        <button>Ajouter</button>
      </div>
    </nav>
  );
}

const style = tv({
  base: "flex justify-between rounded-xl border border-gray-200 bg-white px-3",
  slots: {
    link: "border-r px-4 py-3 text-sm",
  },
});
