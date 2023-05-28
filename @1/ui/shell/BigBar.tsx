//

import type { PropsWithChildren } from "react";

//

export function BigBar({ children }: PropsWithChildren) {
  return (
    <header className="flex justify-center">
      <div className="py-12">{children}</div>
    </header>
  );
}

//
