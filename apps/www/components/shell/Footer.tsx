//

import Link from "next/link";
import { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
//

export function Footer({
  children,
  now,
  year,
}: PropsWithChildren<{ now?: string; year?: number }>) {
  const { link } = footer();
  return (
    <footer className="relative flex min-h-[theme(spacing.8)] justify-center bg-primary-gradient p-1 text-xs text-gray-100 drop-shadow-2xl">
      <section>{children}</section>
      <section className="flex flex-col items-center justify-center gap-2">
        <section className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link className={link()} href="/who">
            Qui sommes-nous ?
          </Link>
          -
          <Link className={link()} href="/legal">
            Conditions générales d'utilisation
          </Link>
          -
          <Link className={link()} href="/confidentiality">
            Politique de confidentialité
          </Link>
          -
          <Link className={link()} href="/moderation">
            Règles de modération
          </Link>
          -
          <Link className={link()} href="/notices">
            Mentions légales
          </Link>
          -
          <Link className={link()} href="/faq">
            FAQ
          </Link>
          -
          <Link className={link()} href="/status">
            Status
          </Link>
        </section>
        <section>
          ©{year} Serkels / {now}
        </section>
      </section>
    </footer>
  );
}
const footer = tv({
  base: "",
  slots: {
    link: "text-md text-center font-bold hover:text-secondary",
  },
});

//
