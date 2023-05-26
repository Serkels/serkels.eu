//

import type { PropsWithChildren } from "react";
import { Logo } from "../icons/Logo";

//

export function AppBigBar(props: PropsWithChildren) {
  return (
    <header un-px="1" un-py="3" un-flex="~ items-center" {...props}>
      <div un-flex="~ 1 " un-px="1rem" un-sm-px="2rem" un-justify="center">
        <Logo />
      </div>
    </header>
  );
}

//

// type Props = { position: string };
