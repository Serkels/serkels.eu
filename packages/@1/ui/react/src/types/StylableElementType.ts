import type { ElementType } from "react";

//
export type StylableElementType = ElementType<{
  className?: string | undefined;
}>;
