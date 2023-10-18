//

import { type PropsWithChildren } from "react";

//

export function Footer({
  children,
  now,
  year,
}: PropsWithChildren<{ now?: string; year?: number }>) {
  return (
    <footer className="bg-primary-gradient relative -z-10 flex min-h-[25px] justify-center p-1 text-xs text-gray-100 drop-shadow-2xl">
      <section>{children}</section>
      <section>
        ©{year} Toc-Toc / <small>{now}</small>
      </section>
    </footer>
  );
}

//
