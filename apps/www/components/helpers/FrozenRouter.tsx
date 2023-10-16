//
// Copy-Paste from https://github.com/npostulart/nextgram-with-page-transitions/blob/main/src/components/provider/FrozenRouter.tsx
// \from https://github.com/npostulart/nextgram-with-page-transitions/blob/cf2b0d7c2c839b7a8292f8e6389746dfb75b2121/src/components/provider/FrozenRouter.tsx
//

import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

//

export default function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}
