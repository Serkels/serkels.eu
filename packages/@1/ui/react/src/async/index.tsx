//

import type { InfiniteData } from "@tanstack/react-query";
import type { ComponentProps, PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { Button } from "../button";
import { Spinner } from "../spinner";

//

export function flatten_pages_are_empty<TData extends { data: any[] }>(
  value: InfiniteData<TData>,
) {
  return value.pages.map((page) => page.data).flat().length === 0;
}

//

export function EmptyList({ children }: PropsWithChildren) {
  return (
    <section
      className="
        flex
        h-1/3
        min-h-80
        flex-col
        items-center
        justify-center
        gap-4
        p-8
        text-center
        font-bold
        opacity-50
      "
    >
      {children}
    </section>
  );
}

export function Loading(props: ComponentProps<"div">) {
  const { className, ...other_props } = props;
  return (
    <div
      {...other_props}
      className={tv({ base: "p4 text-center" })({ className })}
    >
      <Spinner />
    </div>
  );
}

export function LoadMoreButton(props: ComponentProps<typeof Button>) {
  const { children, ...other_props } = props;
  return (
    <Button
      className="mx-auto my-6 block"
      state="ghost"
      intent="light"
      {...other_props}
    >
      {children}
    </Button>
  );
}
