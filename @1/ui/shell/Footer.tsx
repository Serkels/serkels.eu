//

import { type PropsWithChildren } from "react";

//

//

export function Footer({ children, now }: PropsWithChildren<{ now?: string }>) {
  return (
    <footer
      className="mt-28 flex min-h-[25px]  justify-center bg-primary-gradient p-1
    text-xs text-gray-100 drop-shadow-2xl"
    >
      <section>{children}</section>
      <section>
        © Toc-Toc / <small>{now}</small>
      </section>
    </footer>
  );
}

//
