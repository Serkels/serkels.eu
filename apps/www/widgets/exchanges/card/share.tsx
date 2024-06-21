//

import { Share_Button } from ":components/Share_Button";
import { useExchange } from "@1.modules/exchange.ui/Card/context";
import { Share } from "@1.ui/react/icons";

//

export function Exchange_Share() {
  const exchange = useExchange();
  const href_searhparams = new URLSearchParams({ q: exchange.title });
  const href = `${window.location.origin}/exchanges?${href_searhparams}`;
  return (
    <Share_Button className="px-0" href={href}>
      <Share className="size-5 text-white" />
    </Share_Button>
  );
}
