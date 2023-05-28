import type { PropsWithChildren } from "react";

//
export function Banner({ children }: PropsWithChildren) {
  return (
    <section className="p-6 bg-primary-gradient text-white">
      <div
        className={`
          container
          m-auto
          max-w-2xl
          min-h-[346px]
          grid gap-4 gap-x-9 grid-cols-1 items-center justify-around
          sm:grid-cols-2
          sm:min-h-[25rem]
      `}
      >
        {children}
      </div>
    </section>
  );
}
