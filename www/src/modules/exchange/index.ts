//

import type { UID } from "@1/core/domain";
import { useMemo } from "react";
import { useInject } from "~/core/react";
import { Exchange_CreateForm_Controller } from "./CreateForm.controller";
import { Exchange_Repository } from "./Exchange_Repository";
import { Exchange_Item_Controller } from "./Item.controller";

//

export function useExchange_item_controller(exchange_id: UID) {
  const repository = useInject(Exchange_Repository);

  return useMemo(
    () => new Exchange_Item_Controller(repository, exchange_id),
    [repository, exchange_id],
  );
}

export function useExchange_create_controller() {
  const repository = useInject(Exchange_Repository);

  return useMemo(
    () => new Exchange_CreateForm_Controller(repository),
    [repository],
  );
}
