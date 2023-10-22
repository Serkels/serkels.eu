//

import { Button } from "@1.ui/react/button";
import { popover } from "@1.ui/react/popover/atom";
import { useTimeoutEffect, useToggle } from "@react-hookz/web";

//

export function ResponseButtons() {
  return <SignUpToAnswer />;
}

function SignUpToAnswer() {
  const [shouldSignUp, setShouldSignUp] = useToggle(false);
  const [, reset] = useTimeoutEffect(() => setShouldSignUp(false), 5000);
  return (
    <div className="relative">
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
