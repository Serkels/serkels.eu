//

import { type PropsWithChildren } from "react";

//

export function Footer({
  children,
  now,
  year,
}: PropsWithChildren<{ now?: string; year?: number }>) {
  return (
    <footer className="relative hidden min-h-[theme(spacing.8)] justify-center bg-primary-gradient p-1 text-xs text-gray-100 drop-shadow-2xl md:flex">
      <section>{children}</section>
      <section>
        ©{year} Serkels / <small>{now}</small>
      </section>
    </footer>
  );
}

//
