//

import type { ComponentPropsWithoutRef } from "react";
import { card } from "./atom";

export function Card(props: ComponentPropsWithoutRef<"div">) {
  const { base } = card();
  const { className, children, ...other_props } = props;
  return (
    <div className={base({ className })} {...other_props}>
      {children}
    </div>
  );
}
