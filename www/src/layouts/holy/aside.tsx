//

import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

//

export function Aside(
  props: ComponentPropsWithoutRef<"aside"> & { title: string }
) {
  const { className, children, title, ...other_props } = props;
  return (
    <aside
      className={clsx("hidden md:col-span-2 md:block xl:col-span-3", className)}
      {...other_props}
    >
      <article className="sticky top-0 pt-10">
        <h3 className="mb-7 text-2xl font-bold uppercase text-Congress_Blue">
          {title}
        </h3>
        {children}
      </article>
    </aside>
  );
}
