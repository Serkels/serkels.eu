"use client";

import { Share_Button } from ":components/Share_Button";
import { useExchange } from "@1.modules/exchange.ui/Card/context";
import { Share } from "@1.ui/react/icons";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";

//

export function Exchange_Share() {
  const exchange = useExchange();
  const href = `${window.location.origin}/exchanges/${exchange.id}`;
  return (
    <Share_Button href={href}>
      <VisuallyHidden>Share the exchange</VisuallyHidden>
      <Share className="size-5 text-white" />
    </Share_Button>
  );
}
