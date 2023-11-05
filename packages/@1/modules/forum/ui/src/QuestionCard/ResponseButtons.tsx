//

import { Button } from "@1.ui/react/button";
import { popover } from "@1.ui/react/popover/atom";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";

//

export function SignUpToAnswer() {
  const [shouldSignUp, setShouldSignUp] = useToggle(false);
  const [, reset] = useTimeoutEffect(() => setShouldSignUp(false), 6_666);
  return (
    <div className="relative -ml-4">
      {shouldSignUp ? (
        <div className={popover()}>Connectez-vous pour répondre</div>
      ) : null}
      <Button
        state="ghost"
        size="md"
        onPress={() => (setShouldSignUp(true), reset())}
      >
        Répondre
      </Button>
    </div>
  );
}
