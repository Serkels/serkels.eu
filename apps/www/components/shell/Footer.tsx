//

import { type PropsWithChildren } from "react";

//

export function Footer({
  children,
  now,
  year,
}: PropsWithChildren<{ now?: string; year?: number }>) {
  return (
    <footer
      className="
        relative
        flex
        min-h-[theme(spacing.8)]
        justify-center
        bg-primary-gradient
        p-1
        text-xs
        text-gray-100
        drop-shadow-2xl
      "
    >
      <section>{children}</section>
      <section>
        ©{year} Toc-Toc / <small>{now}</small>
      </section>
    </footer>
  );
}

//
