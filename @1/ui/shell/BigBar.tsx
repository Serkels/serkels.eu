//

import type { PropsWithChildren } from "react";

//

export function BigBar({ children }: PropsWithChildren) {
  return (
    <header className="flex justify-center">
      <div className="mt-3 py-12">{children}</div>
    </header>
  );
}

//
