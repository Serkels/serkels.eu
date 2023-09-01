//

import type { ComponentPropsWithoutRef } from "react";
import tw from "tailwind-styled-components";

//

console.log("AsideBar.name");
export const AsideBar = tw.aside`
  hidden
  md:col-span-2
  md:block
  xl:col-span-3
`;

export function AsideWithTitle(
  props: ComponentPropsWithoutRef<"aside"> & { title: string },
) {
  const { className, children, title, ...other_props } = props;
  return (
    <AsideBar {...other_props}>
      <article className="sticky top-[theme(spacing.14)] pt-10">
        <h3 className="mb-7 text-2xl font-bold uppercase text-Congress_Blue">
          {title}
        </h3>
        {children}
      </article>
    </AsideBar>
  );
}
