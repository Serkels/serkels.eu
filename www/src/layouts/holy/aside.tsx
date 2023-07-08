//

import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

//

export function AsideBar(props: ComponentPropsWithoutRef<"aside">) {
  const { className, children, ...other_props } = props;
  return (
    <aside
      className={clsx(
        "hidden max-w-fit md:col-span-2 md:block xl:col-span-3",
        className
      )}
      {...other_props}
    >
      {children}
    </aside>
  );
}

export function AsideWithTitle(
  props: ComponentPropsWithoutRef<"aside"> & { title: string }
) {
  const { className, children, title, ...other_props } = props;
  return (
    <AsideBar {...other_props}>
      <article className="sticky top-[66px] pt-10">
        <h3 className="mb-7 text-2xl font-bold uppercase text-Congress_Blue">
          {title}
        </h3>
        {children}
      </article>
    </AsideBar>
  );
}
