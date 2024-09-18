//

import { useOutletState } from "@1.modules/exchange.ui/Card/context";
import { Button } from "@1.ui/react/button";
import { Trash } from "@1.ui/react/icons";
import { useEffect } from "react";

//

export function Exchange_Delete_Button() {
  // const exchange = useExchange();
  const [outlet, set_outlet] = useOutletState();
  const should_delete = outlet.state === "should_delete";

  useEffect(() => {
    if (!should_delete) return;

    if (!window.confirm("Êtes vous sur de vouloir supprimer cette echange ?")) {
      set_outlet({ state: "idle" });
      return;
    }

    set_outlet({ state: "deleting" });
  }, [should_delete]);

  return (
    <Button
      variant={{ intent: "light", size: "sm", state: "ghost" }}
      className="box-content h-7 p-2"
      onPress={() => set_outlet({ state: "should_delete" })}
    >
      <Trash className="h-4 text-white" />
    </Button>
  );
}
