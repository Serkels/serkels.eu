//

import { useContext } from "react";
import { DialogContext } from "react-aria-components";

//

export function MessageSent() {
  const state = useContext(DialogContext);
  console.log(
    "/home/x/zzz/github/toctocorg/toctoc/packages/@1/modules/exchange/ui/src/ask/sent.tsx",
  );
  console.log({ state });
  // useTimeoutEffect(state. ?? (() => {}), 3_333);

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h1
        className={`
          mx-auto
          my-0
          text-center
          text-xl
          font-extrabold
        `}
      >
        Message envoyé
      </h1>
      <div className="mx-auto mt-5 text-center">📮</div>
    </div>
  );
}
