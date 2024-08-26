//

import { Button } from "@1.ui/react/button";
import { popover } from "@1.ui/react/popover/atom";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";
import type { ComponentProps } from "react";
import { useNewOutletState } from "./context";

//

export function SignUpToAnswer() {
  const [shouldSignUp, setShouldSignUp] = useToggle(false);
  const [, reset] = useTimeoutEffect(() => setShouldSignUp(false), 6_666);
  return (
    <div className="relative">
      {shouldSignUp ? (
        <div className={popover()}>Connectez-vous pour répondre</div>
      ) : null}
      <ResponseButtons onPress={() => (setShouldSignUp(true), reset())} />
    </div>
  );
}

export function ToggleOutlet() {
  const [, set_new_outlet] = useNewOutletState();
  return <ResponseButtons onPress={() => set_new_outlet({ state: "idle" })} />;
}

export function ResponseButtons(props: ComponentProps<typeof Button>) {
  return (
    <Button state="ghost" size="md" {...props}>
      Répondre
    </Button>
  );
}
