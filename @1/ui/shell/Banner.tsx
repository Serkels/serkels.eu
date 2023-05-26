import type { PropsWithChildren } from "react";

//
export function Banner({ children }: PropsWithChildren) {
  return (
    <section un-p="6" un-bg-image="$brand-rainbow" un-color="white">
      <div
        un-container="~"
        un-gap-x="9"
        un-m="auto"
        un-min-h="lg"
        un-max-w="4xl"
        un-grid="~ cols-1 items-center"
        un-justify-content="space-around"
        un-sm-grid="cols-2 items-center"
        un-sm-min-h="xl"
      >
        {children}
      </div>
    </section>
  );
}
