///

import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="col-span-full bg-primary-gradient-large text-white">
      {children} :S
    </div>
  );
}
