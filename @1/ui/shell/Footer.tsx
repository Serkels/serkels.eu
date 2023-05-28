//

import { type PropsWithChildren } from "react";

//

//

export function Footer({ children, now }: PropsWithChildren<{ now?: string }>) {
  return (
    <footer
      className="flex justify-center min-h-[25px]  drop-shadow-2xl text-gray-100 p-1
    bg-primary-gradient text-xs"
    >
      <section>{children}</section>
      <section>
        © Toc-Toc / <small>{now}</small>
      </section>
    </footer>
  );
}

//
