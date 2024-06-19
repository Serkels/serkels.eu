//

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Aside } from "./layout.client";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Inbox :: ${(await parent).title?.absolute}`,
  };
}

//

export default function Layout({
  children,
  navbar,
}: PropsWithChildren<{ navbar: ReactNode }>) {
  const { base, aside, main } = layout_classes();
  return (
    <div className={base()}>
      <Aside className={aside()}>{navbar}</Aside>
      <div className={main()}>{children}</div>
    </div>
  );
}

const layout_classes = tv({
  base: `
    grid
    h-full
    max-h-[calc(100vh_-_theme(spacing.32))]
    md:max-h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.8))]
    md:grid-cols-6
    xl:grid-cols-10
  `,
  slots: {
    aside: "col-span-3",
    main: "col-span-3 bg-white max-md:has-[>_.hidden]:hidden xl:col-span-7",
  },
});
